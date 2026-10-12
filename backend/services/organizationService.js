const OrganizationSetup = require('../models/OrganizationSetup');

const DEFAULTS = {
  details: {
    name: "EduPro International School",
    email: "admin@edupro.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Education Boulevard, Tech City, TX 75001",
    registration_number: "EDUPRO-2026-991X",
    established_year: 1998,
  },
  hierarchy: [
    {
      id: 1,
      level: "Board of Directors",
      children: [
        {
          id: 2,
          level: "Principal / Headmaster",
          children: [
            {
              id: 3,
              level: "Head of Departments",
              children: [{ id: 4, level: "Senior Teaching Staff" }, { id: 5, level: "Junior Teaching Staff" }],
            },
            {
              id: 6,
              level: "Support & Administration",
              children: [{ id: 7, level: "Finance Operations" }, { id: 8, level: "IT & Infrastructure" }],
            },
          ],
        },
      ],
    },
  ],
  settings: [
    { id: 1, key: "auto_attendance_sms", title: "Auto-SMS on Absentee", value: true, category: "Communication" },
    { id: 2, key: "two_factor_auth", title: "Enforce 2FA for Staff", value: false, category: "Security" },
    { id: 3, key: "default_grading", title: "Default Grading System", value: "GPA (4.0 Scale)", category: "Academic" },
    { id: 4, key: "maintenance_mode", title: "System Maintenance Mode", value: false, category: "System" },
  ],
  policies: [
    { id: 101, title: "Student Code of Conduct", content: "Guidelines outlining behavioral expectations for all enrolled students.", is_active: true },
    { id: 102, title: "Staff Leave Policy", content: "Allocations for sick leave, PTO, and emergency procedures.", is_active: true },
    { id: 103, title: "Data Privacy & GDPR", content: "Rules regarding student data handling and system access logs.", is_active: true },
  ],
};

async function getOrCreate() {
  const existing = await OrganizationSetup.findOne({ key: 'default' }).lean();
  if (existing) return existing;
  const created = await OrganizationSetup.create({ key: 'default', ...DEFAULTS });
  return created.toObject();
}

exports.fetchOrganizationDetails = async () => {
  const doc = await getOrCreate();
  return doc.details || {};
};

exports.updateOrganizationDetailsState = async (payload) => {
  const updated = await OrganizationSetup.findOneAndUpdate(
    { key: 'default' },
    { $set: { details: { ...(DEFAULTS.details || {}), ...(payload || {}) } } },
    { new: true, upsert: true }
  ).lean();
  return updated.details || {};
};

exports.fetchHierarchy = async () => {
  const doc = await getOrCreate();
  return doc.hierarchy || [];
};

exports.addHierarchyNode = async (payload) => {
  const node = { id: Date.now(), level: payload?.level || 'New Node', children: [] };
  const updated = await OrganizationSetup.findOneAndUpdate(
    { key: 'default' },
    { $push: { hierarchy: node } },
    { new: true, upsert: true }
  ).lean();
  return node;
};

exports.fetchSettings = async () => {
  const doc = await getOrCreate();
  return doc.settings || [];
};

exports.fetchPolicies = async () => {
  const doc = await getOrCreate();
  return doc.policies || [];
};

exports.addPolicy = async (payload) => {
  const policy = { id: Date.now(), title: payload?.title || 'New Policy', content: payload?.content || '', is_active: true };
  await OrganizationSetup.findOneAndUpdate(
    { key: 'default' },
    { $push: { policies: policy } },
    { new: true, upsert: true }
  ).lean();
  return policy;
};
