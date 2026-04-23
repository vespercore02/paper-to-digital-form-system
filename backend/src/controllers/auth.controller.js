const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  me,
};