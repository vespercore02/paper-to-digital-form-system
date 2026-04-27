const { sequelize } = require('../config/db');

const User = require('./user.model');
const Department = require('./department.model');

const db = {
  sequelize,
  User,
  Department,
};

db.sequelize = sequelize;

// future models dito mo ilalagay

module.exports = db;