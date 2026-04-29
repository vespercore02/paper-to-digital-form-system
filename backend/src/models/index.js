const { sequelize } = require('../config/db');

const User = require('./user.model');
const Department = require('./department.model');
const FormTemplate = require('./formTemplate.model');
const FormField = require('./formField.model');
const FormSubmission = require('./formSubmission.model');
const SubmissionValue = require('./submissionValue.model');

Department.hasMany(FormTemplate, { foreignKey: 'department_id' });
FormTemplate.belongsTo(Department, { foreignKey: 'department_id' });

User.hasMany(FormTemplate, { foreignKey: 'created_by', as: 'createdTemplates' });
FormTemplate.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

FormTemplate.hasMany(FormField, { foreignKey: 'template_id', as: 'fields' });
FormField.belongsTo(FormTemplate, { foreignKey: 'template_id', as: 'template' });

FormTemplate.hasMany(FormSubmission, { foreignKey: 'template_id', as: 'submissions' });
FormSubmission.belongsTo(FormTemplate, { foreignKey: 'template_id', as: 'template' });

FormSubmission.hasMany(SubmissionValue, { foreignKey: 'submission_id', as: 'values' });
SubmissionValue.belongsTo(FormSubmission, { foreignKey: 'submission_id', as: 'submission' });

FormField.hasMany(SubmissionValue, { foreignKey: 'field_id', as: 'submittedValues' });
SubmissionValue.belongsTo(FormField, { foreignKey: 'field_id', as: 'field' });

User.hasMany(FormSubmission, { foreignKey: 'submitted_by', as: 'submittedForms' });
FormSubmission.belongsTo(User, { foreignKey: 'submitted_by', as: 'submitter' });

User.hasMany(FormSubmission, { foreignKey: 'reviewed_by', as: 'reviewedForms' });
FormSubmission.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

const db = {
  sequelize,
  User,
  Department,
  FormTemplate,
  FormField,
  FormSubmission,
SubmissionValue,
};

db.sequelize = sequelize;

// future models dito mo ilalagay

module.exports = db;