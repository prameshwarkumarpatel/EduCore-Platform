const service = require('../services/linkedStudentsService');

exports.getLinkedStudents = async (req, res, next) => {
  try {
    const data = await service.fetchLinkedStudents(req.params.parentId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.linkStudent = async (req, res, next) => {
  try {
    const { studentId, relationshipType } = req.body;
    const data = await service.linkStudent(req.params.parentId, { studentId, relationshipType });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.unlinkStudent = async (req, res, next) => {
  try {
    const data = await service.unlinkStudent(req.params.parentId, req.params.studentId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateRelationshipType = async (req, res, next) => {
  try {
    const { relationshipType } = req.body;
    const data = await service.updateRelationshipType(
      req.params.parentId,
      req.params.studentId,
      relationshipType
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getStudentDetails = async (req, res, next) => {
  try {
    const data = await service.fetchStudentDetails(req.params.studentId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.searchStudents = async (req, res, next) => {
  try {
    const { search, class: cls, section } = req.query;
    const data = await service.searchStudentsForLinking(req.params.parentId, {
      search,
      class: cls,
      section,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};
