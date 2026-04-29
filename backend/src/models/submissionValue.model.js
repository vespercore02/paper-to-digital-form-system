const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SubmissionValue = sequelize.define(
  'SubmissionValue',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    submission_id: { type: DataTypes.INTEGER, allowNull: false },
    field_id: { type: DataTypes.INTEGER, allowNull: false },
    field_key: { type: DataTypes.STRING, allowNull: false },
    value_text: { type: DataTypes.TEXT, allowNull: true },
    value_json: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: 'submission_values',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = SubmissionValue;