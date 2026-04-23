const { sequelize } = require('../config/db');

const User = require('./user.model');

const db = {
  sequelize,
  User,
};

db.sequelize = sequelize;

// future models dito mo ilalagay

module.exports = db;