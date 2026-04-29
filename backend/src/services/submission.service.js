const db = require('../models');
const TEMPLATE_STATUS = require('../constants/templateStatus');
const SUBMISSION_STATUS = require('../constants/submissionStatus');

const generateSubmissionNo = async () => {
  const count = await db.FormSubmission.count();
  const year = new Date().getFullYear();
  return `SUB-${year}-${String(count + 1).padStart(5, '0')}`;
};

const getTemplateWithFields = async (templateId) => {
  const template = await db.FormTemplate.findByPk(templateId, {
    include: [
      {
        model: db.FormField,
        as: 'fields',
        where: { is_active: true },
        required: false,
      },
    ],
  });

  if (!template) {
    const error = new Error('Form template not found');
    error.statusCode = 404;
    throw error;
  }

  if (template.status !== TEMPLATE_STATUS.PUBLISHED) {
    const error = new Error('Form is not published');
    error.statusCode = 403;
    throw error;
  }

  return template;
};

const validateSubmissionValues = (fields, values) => {
  const errors = [];

  fields.forEach((field) => {
    const value = values ? values[field.field_key] : undefined;

    if (field.is_required) {
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        errors.push(`${field.label} is required`);
      }
    }
  });

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.statusCode = 400;
    throw error;
  }
};

const createSubmission = async (templateId, values, userId = null) => {
  const template = await getTemplateWithFields(templateId);
  const fields = template.fields || [];

  validateSubmissionValues(fields, values);

  const transaction = await db.sequelize.transaction();

  try {
    const submissionNo = await generateSubmissionNo();

    const submission = await db.FormSubmission.create(
      {
        template_id: template.id,
        submission_no: submissionNo,
        submitted_by: userId,
        status: SUBMISSION_STATUS.SUBMITTED,
      },
      { transaction }
    );

    const valueRows = fields.map((field) => {
      const value = values ? values[field.field_key] : null;

      const isObjectValue = Array.isArray(value) || typeof value === 'object';

      return {
        submission_id: submission.id,
        field_id: field.id,
        field_key: field.field_key,
        value_text: isObjectValue ? null : value === undefined ? null : String(value),
        value_json: isObjectValue ? value : null,
      };
    });

    await db.SubmissionValue.bulkCreate(valueRows, { transaction });

    await transaction.commit();

    return getSubmissionById(submission.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getSubmissions = async () => {
  return db.FormSubmission.findAll({
    include: [
      {
        model: db.FormTemplate,
        as: 'template',
        attributes: ['id', 'code', 'title', 'version'],
      },
      {
        model: db.User,
        as: 'submitter',
        attributes: ['id', 'first_name', 'last_name', 'email'],
      },
    ],
    order: [['id', 'DESC']],
  });
};

const getSubmissionById = async (id) => {
  const submission = await db.FormSubmission.findByPk(id, {
    include: [
      {
        model: db.FormTemplate,
        as: 'template',
        attributes: ['id', 'code', 'title', 'description', 'version'],
      },
      {
        model: db.User,
        as: 'submitter',
        attributes: ['id', 'first_name', 'last_name', 'email'],
      },
      {
        model: db.User,
        as: 'reviewer',
        attributes: ['id', 'first_name', 'last_name', 'email'],
      },
      {
        model: db.SubmissionValue,
        as: 'values',
        include: [
          {
            model: db.FormField,
            as: 'field',
            attributes: ['id', 'label', 'field_type', 'display_order'],
          },
        ],
      },
    ],
    order: [[{ model: db.SubmissionValue, as: 'values' }, { model: db.FormField, as: 'field' }, 'display_order', 'ASC']],
  });

  if (!submission) {
    const error = new Error('Submission not found');
    error.statusCode = 404;
    throw error;
  }

  return submission;
};

const updateSubmissionStatus = async (id, payload, reviewerId) => {
  const { status, remarks } = payload;

  if (!Object.values(SUBMISSION_STATUS).includes(status)) {
    const error = new Error('Invalid submission status');
    error.statusCode = 400;
    throw error;
  }

  const submission = await db.FormSubmission.findByPk(id);

  if (!submission) {
    const error = new Error('Submission not found');
    error.statusCode = 404;
    throw error;
  }

  submission.status = status;
  submission.remarks = remarks || submission.remarks;
  submission.reviewed_by = reviewerId;
  submission.reviewed_at = new Date();

  await submission.save();

  return getSubmissionById(submission.id);
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
};