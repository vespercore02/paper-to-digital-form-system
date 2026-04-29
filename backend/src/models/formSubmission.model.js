const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const SUBMISSION_STATUS = require('../constants/submissionStatus');

const FormSubmission = sequelize.define(
  'FormSubmission',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    template_id: { type: DataTypes.INTEGER, allowNull: false },
    submission_no: { type: DataTypes.STRING, allowNull: false, unique: true },
    submitted_by: { type: DataTypes.INTEGER, allowNull: true },
    status: {
      type: DataTypes.ENUM(...Object.values(SUBMISSION_STATUS)),
      allowNull: false,
      defaultValue: SUBMISSION_STATUS.SUBMITTED,
    },
    submitted_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    reviewed_by: { type: DataTypes.INTEGER, allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
    remarks: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'form_submissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = FormSubmission;