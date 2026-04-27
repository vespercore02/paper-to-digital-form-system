const { sequelize } = require('../config/db');

const User = require('./user.model');
const Department = require('./department.model');
const FormTemplate = require('./formTemplate.model');
const FormField = require('./formField.model');

Department.hasMany(FormTemplate, { foreignKey: 'department_id' });
FormTemplate.belongsTo(Department, { foreignKey: 'department_id' });

User.hasMany(FormTemplate, { foreignKey: 'created_by', as: 'createdTemplates' });
FormTemplate.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

FormTemplate.hasMany(FormField, { foreignKey: 'template_id', as: 'fields' });
FormField.belongsTo(FormTemplate, { foreignKey: 'template_id', as: 'template' });


const db = {
  sequelize,
  User,
  Department,
  FormTemplate,
  FormField,
};

db.sequelize = sequelize;

// future models dito mo ilalagay

module.exports = db;