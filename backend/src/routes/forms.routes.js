const express = require('express');
const formController = require('../controllers/form.controller');

const router = express.Router();

router.get('/:templateId', formController.getPublishedFormSchema);

module.exports = router;