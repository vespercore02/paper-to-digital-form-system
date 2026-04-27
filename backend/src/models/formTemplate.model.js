const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const TEMPLATE_STATUS = require('../constants/templateStatus');

const FormTemplate = sequelize.define(
  'FormTemplate',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    department_id: { type: DataTypes.INTEGER, allowNull: true },
    version: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    status: {
      type: DataTypes.ENUM(
        TEMPLATE_STATUS.DRAFT,
        TEMPLATE_STATUS.PUBLISHED,
        TEMPLATE_STATUS.ARCHIVED
      ),
      allowNull: false,
      defaultValue: TEMPLATE_STATUS.DRAFT,
    },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    updated_by: { type: DataTypes.INTEGER, allowNull: true },
    published_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'form_templates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = FormTemplate;