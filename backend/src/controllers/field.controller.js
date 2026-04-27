const fieldService = require('../services/field.service');

const createField = async (req, res, next) => {
  try {
    const field = await fieldService.createField(req.params.templateId, req.body);
    res.status(201).json({ field });
  } catch (error) {
    next(error);
  }
};

const getFieldsByTemplate = async (req, res, next) => {
  try {
    const fields = await fieldService.getFieldsByTemplate(req.params.templateId);
    res.status(200).json({ fields });
  } catch (error) {
    next(error);
  }
};

const updateField = async (req, res, next) => {
  try {
    const field = await fieldService.updateField(req.params.id, req.body);
    res.status(200).json({ field });
  } catch (error) {
    next(error);
  }
};

const deleteField = async (req, res, next) => {
  try {
    const result = await fieldService.deleteField(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const reorderFields = async (req, res, next) => {
  try {
    const fields = await fieldService.reorderFields(
      req.params.templateId,
      req.body.orderedFieldIds
    );
    res.status(200).json({ fields });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createField,
  getFieldsByTemplate,
  updateField,
  deleteField,
  reorderFields,
};