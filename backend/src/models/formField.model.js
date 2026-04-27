const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const FIELD_TYPES = require('../constants/fieldTypes');

const FormField = sequelize.define(
  'FormField',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    field_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placeholder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    help_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    field_type: {
      type: DataTypes.ENUM(...Object.values(FIELD_TYPES)),
      allowNull: false,
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    default_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    options_json: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    validation_json: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 12,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'form_fields',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['template_id', 'field_key'],
      },
    ],
  }
);

module.exports = FormField;