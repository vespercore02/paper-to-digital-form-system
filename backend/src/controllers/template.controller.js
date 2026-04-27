const templateService = require('../services/template.service');

const createTemplate = async (req, res, next) => {
  try {
    const template = await templateService.createTemplate(req.body, req.user.id);
    res.status(201).json({ template });
  } catch (error) {
    next(error);
  }
};

const getTemplates = async (req, res, next) => {
  try {
    const templates = await templateService.getTemplates();
    res.status(200).json({ templates });
  } catch (error) {
    next(error);
  }
};

const getTemplateById = async (req, res, next) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    res.status(200).json({ template });
  } catch (error) {
    next(error);
  }
};

const updateTemplate = async (req, res, next) => {
  try {
    const template = await templateService.updateTemplate(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json({ template });
  } catch (error) {
    next(error);
  }
};

const updateTemplateStatus = async (req, res, next) => {
  try {
    const template = await templateService.updateTemplateStatus(
      req.params.id,
      req.body.status,
      req.user.id
    );
    res.status(200).json({ template });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  updateTemplateStatus,
};