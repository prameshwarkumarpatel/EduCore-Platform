const service = require('../services/academicAnalyticsService');

exports.getOverview = async (req, res, next) => {
  try {
    res.json(await service.fetchAcademicOverview());
  } catch (e) {
    next(e);
  }
};

exports.getCurriculum = async (req, res, next) => {
  try {
    res.json(await service.fetchCurriculumProgress());
  } catch (e) {
    next(e);
  }
};

exports.getLessonPlanning = async (req, res, next) => {
  try {
    res.json(await service.fetchLessonPlanningStats());
  } catch (e) {
    next(e);
  }
};

exports.getHomework = async (req, res, next) => {
  try {
    res.json(await service.fetchHomeworkStatus());
  } catch (e) {
    next(e);
  }
};

exports.getMaterials = async (req, res, next) => {
  try {
    res.json(await service.fetchStudyMaterialSummary());
  } catch (e) {
    next(e);
  }
};

exports.getActivities = async (req, res, next) => {
  try {
    res.json(await service.fetchAcademicActivities());
  } catch (e) {
    next(e);
  }
};

exports.getInsights = async (req, res, next) => {
  try {
    res.json(await service.fetchPerformanceInsights());
  } catch (e) {
    next(e);
  }
};
