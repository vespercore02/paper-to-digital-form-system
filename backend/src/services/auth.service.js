const validator = require('validator');
const db = require('../models');
const { comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  if (!validator.isEmail(email)) {
    const error = new Error('Invalid email format');
    error.statusCode = 400;
    throw error;
  }

  const user = await db.User.findOne({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.is_active) {
    const error = new Error('User is inactive');
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password_hash);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  };
};

const getCurrentUser = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'is_active'],
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  loginUser,
  getCurrentUser,
};