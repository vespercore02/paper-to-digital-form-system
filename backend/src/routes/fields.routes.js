const express = require('express');
const fieldController = require('../controllers/field.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get(
  '/templates/:templateId/fields',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  fieldController.getFieldsByTemplate
);

router.post(
  '/templates/:templateId/fields',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  fieldController.createField
);

router.patch(
  '/templates/:templateId/fields/reorder',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  fieldController.reorderFields
);

router.put(
  '/fields/:id',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  fieldController.updateField
);

router.delete(
  '/fields/:id',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  fieldController.deleteField
);

module.exports = router;