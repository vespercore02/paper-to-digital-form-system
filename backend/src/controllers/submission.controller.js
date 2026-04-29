const submissionService = require('../services/submission.service');

const createSubmission = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    const submission = await submissionService.createSubmission(
      req.params.templateId,
      req.body.values,
      userId
    );

    res.status(201).json({ submission });
  } catch (error) {
    next(error);
  }
};

const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await submissionService.getSubmissions();
    res.status(200).json({ submissions });
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await submissionService.getSubmissionById(req.params.id);
    res.status(200).json({ submission });
  } catch (error) {
    next(error);
  }
};

const updateSubmissionStatus = async (req, res, next) => {
  try {
    const submission = await submissionService.updateSubmissionStatus(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(200).json({ submission });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
};