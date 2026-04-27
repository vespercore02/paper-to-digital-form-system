const departmentService = require('../services/department.service');

const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    return res.status(201).json({ department });
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getDepartments();
    return res.status(200).json({ departments });
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    return res.status(200).json({ department });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    return res.status(200).json({ department });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
};