const express = require('express');
const submissionController = require('../controllers/submission.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.post(
  '/forms/:templateId/submissions',
  submissionController.createSubmission
);

router.get(
  '/submissions',
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  submissionController.getSubmissions
);

router.get(
  '/submissions/:id',
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  submissionController.getSubmissionById
);

router.patch(
  '/submissions/:id/status',
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  submissionController.updateSubmissionStatus
);

module.exports = router;