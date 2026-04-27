const db = require('../models');
const FIELD_TYPES = require('../constants/fieldTypes');
const TEMPLATE_STATUS = require('../constants/templateStatus');

const normalizeFieldKey = (labelOrKey) => {
  return String(labelOrKey)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_');
};

const validateOptions = (fieldType, options) => {
  const optionRequiredTypes = [
    FIELD_TYPES.SELECT,
    FIELD_TYPES.RADIO,
    FIELD_TYPES.CHECKBOX,
  ];

  if (!optionRequiredTypes.includes(fieldType)) {
    return null;
  }

  if (!Array.isArray(options) || options.length === 0) {
    const error = new Error(`${fieldType} field requires options`);
    error.statusCode = 400;
    throw error;
  }

  return options.map((option) => String(option).trim()).filter(Boolean);
};

const ensureTemplateEditable = async (templateId) => {
  const template = await db.FormTemplate.findByPk(templateId);

  if (!template) {
    const error = new Error('Template not found');
    error.statusCode = 404;
    throw error;
  }

  if (template.status === TEMPLATE_STATUS.ARCHIVED) {
    const error = new Error('Archived templates cannot be modified');
    error.statusCode = 400;
    throw error;
  }

  return template;
};

const getNextDisplayOrder = async (templateId) => {
  const lastField = await db.FormField.findOne({
    where: { template_id: templateId },
    order: [['display_order', 'DESC']],
  });

  return lastField ? lastField.display_order + 1 : 1;
};

const createField = async (templateId, payload) => {
  await ensureTemplateEditable(templateId);

  const {
    field_key,
    label,
    placeholder,
    help_text,
    field_type,
    is_required,
    default_value,
    options_json,
    validation_json,
    width,
  } = payload;

  if (!label || !field_type) {
    const error = new Error('Label and field_type are required');
    error.statusCode = 400;
    throw error;
  }

  if (!Object.values(FIELD_TYPES).includes(field_type)) {
    const error = new Error('Invalid field_type');
    error.statusCode = 400;
    throw error;
  }

  const normalizedKey = normalizeFieldKey(field_key || label);
  const normalizedOptions = validateOptions(field_type, options_json);
  const displayOrder = await getNextDisplayOrder(templateId);

  return db.FormField.create({
    template_id: templateId,
    field_key: normalizedKey,
    label: label.trim(),
    placeholder: placeholder || null,
    help_text: help_text || null,
    field_type,
    is_required: Boolean(is_required),
    default_value: default_value || null,
    options_json: normalizedOptions,
    validation_json: validation_json || null,
    display_order: displayOrder,
    width: width || 12,
  });
};

const getFieldsByTemplate = async (templateId) => {
  await ensureTemplateEditable(templateId);

  return db.FormField.findAll({
    where: {
      template_id: templateId,
      is_active: true,
    },
    order: [['display_order', 'ASC']],
  });
};

const updateField = async (fieldId, payload) => {
  const field = await db.FormField.findByPk(fieldId);

  if (!field) {
    const error = new Error('Field not found');
    error.statusCode = 404;
    throw error;
  }

  await ensureTemplateEditable(field.template_id);

  const {
    field_key,
    label,
    placeholder,
    help_text,
    field_type,
    is_required,
    default_value,
    options_json,
    validation_json,
    display_order,
    width,
    is_active,
  } = payload;

  const nextType = field_type || field.field_type;

  if (field_type && !Object.values(FIELD_TYPES).includes(field_type)) {
    const error = new Error('Invalid field_type');
    error.statusCode = 400;
    throw error;
  }

  if (field_key) field.field_key = normalizeFieldKey(field_key);
  if (label) field.label = label.trim();
  if (placeholder !== undefined) field.placeholder = placeholder || null;
  if (help_text !== undefined) field.help_text = help_text || null;
  if (field_type) field.field_type = field_type;
  if (is_required !== undefined) field.is_required = Boolean(is_required);
  if (default_value !== undefined) field.default_value = default_value || null;

  if (options_json !== undefined) {
    field.options_json = validateOptions(nextType, options_json);
  }

  if (validation_json !== undefined) {
    field.validation_json = validation_json || null;
  }

  if (display_order !== undefined) field.display_order = Number(display_order);
  if (width !== undefined) field.width = Number(width);
  if (typeof is_active === 'boolean') field.is_active = is_active;

  await field.save();
  return field;
};

const deleteField = async (fieldId) => {
  const field = await db.FormField.findByPk(fieldId);

  if (!field) {
    const error = new Error('Field not found');
    error.statusCode = 404;
    throw error;
  }

  await ensureTemplateEditable(field.template_id);

  field.is_active = false;
  await field.save();

  return { message: 'Field removed successfully' };
};

const reorderFields = async (templateId, orderedFieldIds) => {
  await ensureTemplateEditable(templateId);

  if (!Array.isArray(orderedFieldIds) || orderedFieldIds.length === 0) {
    const error = new Error('orderedFieldIds must be a non-empty array');
    error.statusCode = 400;
    throw error;
  }

  const fields = await db.FormField.findAll({
    where: {
      template_id: templateId,
      is_active: true,
    },
  });

  const existingIds = fields.map((field) => field.id);

  const invalidIds = orderedFieldIds.filter((id) => !existingIds.includes(Number(id)));

  if (invalidIds.length > 0) {
    const error = new Error('Some field ids do not belong to this template');
    error.statusCode = 400;
    throw error;
  }

  await Promise.all(
    orderedFieldIds.map((fieldId, index) =>
      db.FormField.update(
        { display_order: index + 1 },
        { where: { id: fieldId, template_id: templateId } }
      )
    )
  );

  return getFieldsByTemplate(templateId);
};

module.exports = {
  createField,
  getFieldsByTemplate,
  updateField,
  deleteField,
  reorderFields,
};