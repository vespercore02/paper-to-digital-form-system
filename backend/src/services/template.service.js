const db = require('../models');
const TEMPLATE_STATUS = require('../constants/templateStatus');

const generateTemplateCode = async () => {
  const count = await db.FormTemplate.count();
  return `FORM-${String(count + 1).padStart(4, '0')}`;
};

const createTemplate = async (payload, userId) => {
  const { title, description, department_id } = payload;

  if (!title) {
    const error = new Error('Template title is required');
    error.statusCode = 400;
    throw error;
  }

  if (department_id) {
    const department = await db.Department.findByPk(department_id);
    if (!department) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }
  }

  const code = await generateTemplateCode();

  return db.FormTemplate.create({
    code,
    title: title.trim(),
    description: description || null,
    department_id: department_id || null,
    created_by: userId,
    updated_by: userId,
  });
};

const getTemplates = async () => {
  return db.FormTemplate.findAll({
    include: [
      { model: db.Department, attributes: ['id', 'name', 'code'] },
      { model: db.User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
    ],
    order: [['id', 'DESC']],
  });
};

const getTemplateById = async (id) => {
  const template = await db.FormTemplate.findByPk(id, {
    include: [
      { model: db.Department, attributes: ['id', 'name', 'code'] },
      { model: db.User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
    ],
  });

  if (!template) {
    const error = new Error('Template not found');
    error.statusCode = 404;
    throw error;
  }

  return template;
};

const updateTemplate = async (id, payload, userId) => {
  const template = await db.FormTemplate.findByPk(id);

  if (!template) {
    const error = new Error('Template not found');
    error.statusCode = 404;
    throw error;
  }

  if (template.status === TEMPLATE_STATUS.ARCHIVED) {
    const error = new Error('Archived templates cannot be updated');
    error.statusCode = 400;
    throw error;
  }

  const { title, description, department_id } = payload;

  if (department_id) {
    const department = await db.Department.findByPk(department_id);
    if (!department) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }
    template.department_id = department_id;
  }

  if (title) template.title = title.trim();
  if (description !== undefined) template.description = description || null;

  template.updated_by = userId;

  await template.save();
  return template;
};

const updateTemplateStatus = async (id, status, userId) => {
  const template = await db.FormTemplate.findByPk(id);

  if (!template) {
    const error = new Error('Template not found');
    error.statusCode = 404;
    throw error;
  }

  const allowedStatuses = Object.values(TEMPLATE_STATUS);

  if (!allowedStatuses.includes(status)) {
    const error = new Error('Invalid template status');
    error.statusCode = 400;
    throw error;
  }

  template.status = status;
  template.updated_by = userId;

  if (status === TEMPLATE_STATUS.PUBLISHED) {
    template.published_at = new Date();
  }

  await template.save();
  return template;
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  updateTemplateStatus,
};