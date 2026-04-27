const express = require('express');
const templateController = require('../controllers/template.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get(
  '/',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  templateController.getTemplates
);

router.get(
  '/:id',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  templateController.getTemplateById
);

router.post(
  '/',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  templateController.createTemplate
);

router.put(
  '/:id',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  templateController.updateTemplate
);

router.patch(
  '/:id/status',
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  templateController.updateTemplateStatus
);

module.exports = router;