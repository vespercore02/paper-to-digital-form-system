const formService = require('../services/form.service');

const getPublishedFormSchema = async (req, res, next) => {
  try {
    const form = await formService.getPublishedFormSchema(req.params.templateId);
    res.status(200).json({ form });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublishedFormSchema,
};