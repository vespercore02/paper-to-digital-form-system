const db = require('../models');
const TEMPLATE_STATUS = require('../constants/templateStatus');

const getPublishedFormSchema = async (templateId) => {
  const template = await db.FormTemplate.findByPk(templateId, {
    include: [
      {
        model: db.FormField,
        as: 'fields',
        where: { is_active: true },
        required: false,
        attributes: [
          'id',
          'field_key',
          'label',
          'placeholder',
          'help_text',
          'field_type',
          'is_required',
          'default_value',
          'options_json',
          'validation_json',
          'display_order',
          'width',
        ],
      },
      {
        model: db.Department,
        attributes: ['id', 'name', 'code'],
      },
    ],
    order: [[{ model: db.FormField, as: 'fields' }, 'display_order', 'ASC']],
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

  return {
    id: template.id,
    code: template.code,
    title: template.title,
    description: template.description,
    version: template.version,
    department: template.Department,
    published_at: template.published_at,
    fields: template.fields || [],
  };
};

module.exports = {
  getPublishedFormSchema,
};