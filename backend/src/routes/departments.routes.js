const express = require('express');
const departmentController = require('../controllers/department.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get(
  '/',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  departmentController.getDepartments
);

router.get(
  '/:id',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  departmentController.getDepartmentById
);

router.post(
  '/',
  roleMiddleware(ROLES.SUPER_ADMIN),
  departmentController.createDepartment
);

router.put(
  '/:id',
  roleMiddleware(ROLES.SUPER_ADMIN),
  departmentController.updateDepartment
);

module.exports = router;