const db = require('../models');

const createDepartment = async ({ name, code }) => {
  if (!name || !code) {
    const error = new Error('Name and code are required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedName = name.trim();
  const normalizedCode = code.trim().toUpperCase();

  const existingName = await db.Department.findOne({
    where: { name: normalizedName },
  });

  if (existingName) {
    const error = new Error('Department name already exists');
    error.statusCode = 409;
    throw error;
  }

  const existingCode = await db.Department.findOne({
    where: { code: normalizedCode },
  });

  if (existingCode) {
    const error = new Error('Department code already exists');
    error.statusCode = 409;
    throw error;
  }

  const department = await db.Department.create({
    name: normalizedName,
    code: normalizedCode,
  });

  return department;
};

const getDepartments = async () => {
  return db.Department.findAll({
    order: [['id', 'ASC']],
  });
};

const getDepartmentById = async (id) => {
  const department = await db.Department.findByPk(id);

  if (!department) {
    const error = new Error('Department not found');
    error.statusCode = 404;
    throw error;
  }

  return department;
};

const updateDepartment = async (id, { name, code, is_active }) => {
  const department = await db.Department.findByPk(id);

  if (!department) {
    const error = new Error('Department not found');
    error.statusCode = 404;
    throw error;
  }

  if (name) {
    const normalizedName = name.trim();

    const existingName = await db.Department.findOne({
      where: { name: normalizedName },
    });

    if (existingName && existingName.id !== department.id) {
      const error = new Error('Department name already exists');
      error.statusCode = 409;
      throw error;
    }

    department.name = normalizedName;
  }

  if (code) {
    const normalizedCode = code.trim().toUpperCase();

    const existingCode = await db.Department.findOne({
      where: { code: normalizedCode },
    });

    if (existingCode && existingCode.id !== department.id) {
      const error = new Error('Department code already exists');
      error.statusCode = 409;
      throw error;
    }

    department.code = normalizedCode;
  }

  if (typeof is_active === 'boolean') {
    department.is_active = is_active;
  }

  await department.save();
  return department;
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
};