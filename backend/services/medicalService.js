const mongoose = require('mongoose');
const Student = require('../models/Student');
const MedicalHistory = require('../models/medicalModel');
const Immunization = require('../models/immunizationModel');
const Allergy = require('../models/allergyModel');
const EmergencyContact = require('../models/emergencyContactModel');
const MedicalDocument = require('../models/medicalDocumentModel');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function assertDbConnected() {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
}

function resolveQuery(idOrEnrollmentId) {
  if (mongoose.Types.ObjectId.isValid(idOrEnrollmentId)) return { _id: idOrEnrollmentId };
  return { enrollmentId: idOrEnrollmentId };
}

function toPublicStudent(s) {
  const obj = s.toObject ? s.toObject({ virtuals: false }) : s;
  return {
    id: String(obj._id),
    enrollmentId: obj.enrollmentId || '',
    name: obj.name,
    assignedClass: obj.assignedClass || '',
    assignedSection: obj.assignedSection || '',
    photoUrl: obj.photoUrl || '',
    email: obj.email || '',
    phone: obj.phone || '',
  };
}

function esc(s) {
  return String(s ?? '');
}

async function ensureSeedDataIfEmpty() {
  assertDbConnected();
  const c = await MedicalHistory.countDocuments({});
  if (c > 0) return;

  const students = await Student.find({ status: 'Active' }).limit(25).lean();
  if (!students.length) return;

  const history = [];
  const immunizations = [];
  const allergies = [];
  const contacts = [];

  const historyTypes = ['General', 'Diagnosis', 'Treatment'];
  const titles = ['Asthma', 'Anemia', 'Allergic Rhinitis', 'Vitamin D Deficiency', 'Dental Treatment', 'Fever Management'];
  const reactions = ['Frequent sneezing', 'Mild swelling', 'No severe reaction', 'Medication response', 'Diet-sensitive'];
  const severities = ['Mild', 'Moderate', 'Severe'];
  const vaccineNames = ['DTaP', 'Polio', 'MMR', 'Hepatitis B', 'BCG', 'Varicella', 'Influenza'];

  for (const st of students) {
    const histCount = 2 + Math.floor(Math.random() * 4); // 2..5
    for (let i = 0; i < histCount; i += 1) {
      const dt = new Date(Date.now() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000);
      const title = titles[Math.floor(Math.random() * titles.length)];
      history.push({
        student: st._id,
        recordType: historyTypes[Math.floor(Math.random() * historyTypes.length)],
        title,
        date: dt,
        treatment: `Treatment plan for ${title}`,
        notes: reactions[Math.floor(Math.random() * reactions.length)],
        createdAt: dt,
        updatedAt: dt,
      });
    }

    const immCount = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < immCount; i += 1) {
      const vaccineName = vaccineNames[Math.floor(Math.random() * vaccineNames.length)];
      const completed = Math.random() > 0.35;
      const status = completed ? 'Completed' : 'Pending';
      const dt = completed ? new Date(Date.now() - Math.floor(Math.random() * 900) * 24 * 60 * 60 * 1000) : null;
      immunizations.push({
        student: st._id,
        vaccineName,
        status,
        administeredDate: dt,
        dose: completed ? `Dose ${1 + Math.floor(Math.random() * 3)}` : '',
        notes: completed ? 'Administered as per schedule' : 'Pending next dose',
        createdAt: dt || new Date(),
        updatedAt: dt || new Date(),
      });
    }

    const allergyCount = Math.random() > 0.5 ? 1 : 2;
    for (let i = 0; i < allergyCount; i += 1) {
      const condition = ['Peanut', 'Dust', 'Milk', 'Pollen', 'Nuts', 'Eggs'][Math.floor(Math.random() * 6)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      allergies.push({
        student: st._id,
        condition,
        severity,
        reaction: reactions[Math.floor(Math.random() * reactions.length)],
        notes: 'Allergy listed in student medical profile.',
      });
    }

    // 2 emergency contacts
    const parentA = Math.random() > 0.5 ? 'Parent' : 'Guardian';
    const parentB = parentA === 'Parent' ? 'Guardian' : 'Parent';
    contacts.push(
      {
        student: st._id,
        name: `${st.name.split(' ')[0] || 'Guardian'} ${parentA}`,
        phone: '+1 (555) 000-0001',
        relationship: parentA,
        notes: 'Primary contact',
      },
      {
        student: st._id,
        name: `${st.name.split(' ')[0] || 'Guardian'} ${parentB}`,
        phone: '+1 (555) 000-0002',
        relationship: parentB,
        notes: 'Secondary contact',
      }
    );
  }

  await Promise.all([
    MedicalHistory.insertMany(history, { ordered: false }).catch(() => {}),
    Immunization.insertMany(immunizations, { ordered: false }).catch(() => {}),
    Allergy.insertMany(allergies, { ordered: false }).catch(() => {}),
    EmergencyContact.insertMany(contacts, { ordered: false }).catch(() => {}),
  ]);
}

exports.fetchDashboard = async (studentId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  const [history, immunizations, allergies, emergencyContacts, documents] = await Promise.all([
    MedicalHistory.find({ student: student._id }).sort({ date: -1 }).lean(),
    Immunization.find({ student: student._id }).sort({ administeredDate: -1 }).lean(),
    Allergy.find({ student: student._id }).sort({ severity: 1 }).lean(),
    EmergencyContact.find({ student: student._id }).sort({ createdAt: -1 }).lean(),
    MedicalDocument.find({ student: student._id }).sort({ createdAt: -1 }).lean(),
  ]);

  return {
    student: toPublicStudent(student),
    history,
    immunizations,
    allergies,
    emergencyContacts,
    documents: documents.map((d) => ({
      id: String(d._id),
      docType: d.docType,
      fileName: d.fileName,
      mimeType: d.mimeType,
      dataUrl: d.dataUrl,
      createdAt: d.createdAt,
    })),
  };
};

exports.fetchMedicalHistory = async (studentId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const s = await Student.findOne(resolveQuery(studentId)).lean();
  if (!s) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return MedicalHistory.find({ student: s._id }).sort({ date: -1 }).lean();
};

exports.addMedicalRecord = async (studentId, payload) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  if (!payload?.title) {
    const err = new Error('title is required');
    err.statusCode = 400;
    throw err;
  }
  const date = payload.date ? new Date(payload.date) : new Date();
  if (Number.isNaN(date.getTime())) {
    const err = new Error('Invalid date');
    err.statusCode = 400;
    throw err;
  }

  const record = await MedicalHistory.create({
    student: student._id,
    recordType: payload.recordType || 'General',
    title: payload.title,
    date,
    treatment: payload.treatment || '',
    notes: payload.notes || '',
  });

  return record.toObject ? record.toObject() : record;
};

exports.updateMedicalRecord = async (studentId, recordId, payload) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  const updated = await MedicalHistory.findOneAndUpdate(
    { _id: recordId, student: student._id },
    {
      $set: {
        recordType: payload.recordType ?? 'General',
        title: payload.title ?? undefined,
        date: payload.date ? new Date(payload.date) : undefined,
        treatment: payload.treatment ?? undefined,
        notes: payload.notes ?? undefined,
      },
    },
    { new: true }
  ).lean();

  if (!updated) {
    const err = new Error('Record not found');
    err.statusCode = 404;
    throw err;
  }
  return updated;
};

exports.deleteMedicalRecord = async (studentId, recordId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  const deleted = await MedicalHistory.findOneAndDelete({ _id: recordId, student: student._id }).lean();
  if (!deleted) {
    const err = new Error('Record not found');
    err.statusCode = 404;
    throw err;
  }
  return { id: String(deleted._id) };
};

exports.fetchImmunizations = async (studentId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return Immunization.find({ student: student._id }).sort({ administeredDate: -1 }).lean();
};

exports.addImmunization = async (studentId, payload) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  if (!payload?.vaccineName) {
    const err = new Error('vaccineName is required');
    err.statusCode = 400;
    throw err;
  }
  const administeredDate = payload.administeredDate ? new Date(payload.administeredDate) : undefined;
  if (administeredDate && Number.isNaN(administeredDate.getTime())) {
    const err = new Error('Invalid administeredDate');
    err.statusCode = 400;
    throw err;
  }
  const row = await Immunization.create({
    student: student._id,
    vaccineName: payload.vaccineName,
    status: payload.status || 'Pending',
    administeredDate: administeredDate || undefined,
    dose: payload.dose || '',
    notes: payload.notes || '',
  });
  return row.toObject ? row.toObject() : row;
};

exports.updateImmunization = async (studentId, immunizationId, payload) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  const administeredDate = payload.administeredDate ? new Date(payload.administeredDate) : undefined;
  if (administeredDate && Number.isNaN(administeredDate.getTime())) {
    const err = new Error('Invalid administeredDate');
    err.statusCode = 400;
    throw err;
  }

  const updated = await Immunization.findOneAndUpdate(
    { _id: immunizationId, student: student._id },
    {
      $set: {
        vaccineName: payload.vaccineName ?? undefined,
        status: payload.status ?? undefined,
        administeredDate: administeredDate ?? undefined,
        dose: payload.dose ?? undefined,
        notes: payload.notes ?? undefined,
      },
    },
    { new: true }
  ).lean();
  if (!updated) {
    const err = new Error('Immunization not found');
    err.statusCode = 404;
    throw err;
  }
  return updated;
};

exports.deleteImmunization = async (studentId, immunizationId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  const deleted = await Immunization.findOneAndDelete({ _id: immunizationId, student: student._id }).lean();
  if (!deleted) {
    const err = new Error('Immunization not found');
    err.statusCode = 404;
    throw err;
  }
  return { id: String(deleted._id) };
};

exports.fetchAllergies = async (studentId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return Allergy.find({ student: student._id }).sort({ createdAt: -1 }).lean();
};

exports.addAllergy = async (studentId, payload) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  if (!payload?.condition) {
    const err = new Error('condition is required');
    err.statusCode = 400;
    throw err;
  }
  const row = await Allergy.create({
    student: student._id,
    condition: payload.condition,
    severity: payload.severity || 'Mild',
    reaction: payload.reaction || '',
    notes: payload.notes || '',
  });
  return row.toObject ? row.toObject() : row;
};

exports.updateAllergy = async (studentId, allergyId, payload) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  const updated = await Allergy.findOneAndUpdate(
    { _id: allergyId, student: student._id },
    {
      $set: {
        condition: payload.condition ?? undefined,
        severity: payload.severity ?? undefined,
        reaction: payload.reaction ?? undefined,
        notes: payload.notes ?? undefined,
      },
    },
    { new: true }
  ).lean();
  if (!updated) {
    const err = new Error('Allergy not found');
    err.statusCode = 404;
    throw err;
  }
  return updated;
};

exports.deleteAllergy = async (studentId, allergyId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  const deleted = await Allergy.findOneAndDelete({ _id: allergyId, student: student._id }).lean();
  if (!deleted) {
    const err = new Error('Allergy not found');
    err.statusCode = 404;
    throw err;
  }
  return { id: String(deleted._id) };
};

exports.fetchEmergencyContacts = async (studentId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return EmergencyContact.find({ student: student._id }).sort({ createdAt: -1 }).lean();
};

exports.addEmergencyContact = async (studentId, payload) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  if (!payload?.name || !payload?.phone) {
    const err = new Error('name and phone are required');
    err.statusCode = 400;
    throw err;
  }
  const row = await EmergencyContact.create({
    student: student._id,
    name: payload.name,
    phone: payload.phone,
    relationship: payload.relationship || 'Guardian',
    notes: payload.notes || '',
  });
  return row.toObject ? row.toObject() : row;
};

exports.deleteEmergencyContact = async (studentId, contactId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  const deleted = await EmergencyContact.findOneAndDelete({ _id: contactId, student: student._id }).lean();
  if (!deleted) {
    const err = new Error('Contact not found');
    err.statusCode = 404;
    throw err;
  }
  return { id: String(deleted._id) };
};

exports.fetchDocuments = async (studentId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  const docs = await MedicalDocument.find({ student: student._id }).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({
    id: String(d._id),
    docType: d.docType,
    fileName: d.fileName,
    mimeType: d.mimeType,
    dataUrl: d.dataUrl,
    createdAt: d.createdAt,
  }));
};

exports.uploadDocument = async (studentId, payload) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  if (!payload?.dataUrl) {
    const err = new Error('dataUrl is required');
    err.statusCode = 400;
    throw err;
  }
  if (!payload?.fileName) {
    const err = new Error('fileName is required');
    err.statusCode = 400;
    throw err;
  }

  // simple guard against huge payloads; frontend usually keeps it smaller
  if (payload.dataUrl.length > 10_000_000) {
    const err = new Error('File too large');
    err.statusCode = 413;
    throw err;
  }

  const doc = await MedicalDocument.create({
    student: student._id,
    docType: payload.docType || 'Certificate',
    fileName: payload.fileName,
    mimeType: payload.mimeType || 'application/octet-stream',
    dataUrl: payload.dataUrl,
  });

  return {
    id: String(doc._id),
    docType: doc.docType,
    fileName: doc.fileName,
    mimeType: doc.mimeType,
    createdAt: doc.createdAt,
  };
};

exports.fetchDocumentById = async (docId) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const doc = await MedicalDocument.findById(docId).lean();
  if (!doc) {
    const err = new Error('Document not found');
    err.statusCode = 404;
    throw err;
  }
  return {
    id: String(doc._id),
    docType: doc.docType,
    fileName: doc.fileName,
    mimeType: doc.mimeType,
    dataUrl: doc.dataUrl,
    createdAt: doc.createdAt,
  };
};

