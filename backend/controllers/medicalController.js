const service = require('../services/medicalService');

exports.dashboard = async (req, res, next) => {
  try {
    const data = await service.fetchDashboard(req.params.studentId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.historyList = async (req, res, next) => {
  try {
    const list = await service.fetchMedicalHistory(req.params.studentId);
    res.json({ items: list });
  } catch (e) {
    next(e);
  }
};

exports.historyAdd = async (req, res, next) => {
  try {
    const out = await service.addMedicalRecord(req.params.studentId, req.body || {});
    res.json({ item: out });
  } catch (e) {
    next(e);
  }
};

exports.historyUpdate = async (req, res, next) => {
  try {
    const out = await service.updateMedicalRecord(req.params.studentId, req.params.recordId, req.body || {});
    res.json({ item: out });
  } catch (e) {
    next(e);
  }
};

exports.historyDelete = async (req, res, next) => {
  try {
    const out = await service.deleteMedicalRecord(req.params.studentId, req.params.recordId);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.immunizations = async (req, res, next) => {
  try {
    const out = await service.fetchImmunizations(req.params.studentId);
    res.json({ items: out });
  } catch (e) {
    next(e);
  }
};

exports.immunizationsAdd = async (req, res, next) => {
  try {
    const out = await service.addImmunization(req.params.studentId, req.body || {});
    res.json({ item: out });
  } catch (e) {
    next(e);
  }
};

exports.immunizationsUpdate = async (req, res, next) => {
  try {
    const out = await service.updateImmunization(req.params.studentId, req.params.immunizationId, req.body || {});
    res.json({ item: out });
  } catch (e) {
    next(e);
  }
};

exports.immunizationsDelete = async (req, res, next) => {
  try {
    const out = await service.deleteImmunization(req.params.studentId, req.params.immunizationId);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.allergies = async (req, res, next) => {
  try {
    const out = await service.fetchAllergies(req.params.studentId);
    res.json({ items: out });
  } catch (e) {
    next(e);
  }
};

exports.allergiesAdd = async (req, res, next) => {
  try {
    const out = await service.addAllergy(req.params.studentId, req.body || {});
    res.json({ item: out });
  } catch (e) {
    next(e);
  }
};

exports.allergiesUpdate = async (req, res, next) => {
  try {
    const out = await service.updateAllergy(req.params.studentId, req.params.allergyId, req.body || {});
    res.json({ item: out });
  } catch (e) {
    next(e);
  }
};

exports.allergiesDelete = async (req, res, next) => {
  try {
    const out = await service.deleteAllergy(req.params.studentId, req.params.allergyId);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.emergencyContacts = async (req, res, next) => {
  try {
    const out = await service.fetchEmergencyContacts(req.params.studentId);
    res.json({ items: out });
  } catch (e) {
    next(e);
  }
};

exports.emergencyContactsAdd = async (req, res, next) => {
  try {
    const out = await service.addEmergencyContact(req.params.studentId, req.body || {});
    res.json({ item: out });
  } catch (e) {
    next(e);
  }
};

exports.emergencyContactsDelete = async (req, res, next) => {
  try {
    const out = await service.deleteEmergencyContact(req.params.studentId, req.params.contactId);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.documents = async (req, res, next) => {
  try {
    const out = await service.fetchDocuments(req.params.studentId);
    res.json({ items: out });
  } catch (e) {
    next(e);
  }
};

exports.documentsUpload = async (req, res, next) => {
  try {
    const out = await service.uploadDocument(req.params.studentId, req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.documentById = async (req, res, next) => {
  try {
    const out = await service.fetchDocumentById(req.params.docId);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

