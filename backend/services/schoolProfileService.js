const SchoolProfile = require('../models/SchoolProfile');

const DEFAULTS = {
  name: "EduPro International School",
  established_year: 1998,
  motto: "Empowering Minds, Shaping Futures",
  logo_url: "/school-logo.png",
  phone: "+1 (555) 987-6543",
  email: "info@edupro-international.edu",
  website: "https://www.edupro-international.edu",
  address: {
    street: "789 Academic Avenue",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "USA",
  },
  branding: {
    primary_color: "#3b82f6",
    secondary_color: "#10b981",
  },
};

async function getOrCreate() {
  const existing = await SchoolProfile.findOne({ key: 'default' }).lean();
  if (existing) return existing;
  const created = await SchoolProfile.create({ key: 'default', ...DEFAULTS });
  return created.toObject();
}

exports.getProfile = async () => {
  const doc = await getOrCreate();
  const { _id, __v, ...rest } = doc;
  return rest;
};

exports.updateProfileState = async (payload) => {
  const current = await getOrCreate();
  const merged = {
    ...current,
    ...payload,
    key: 'default',
    address: payload?.address ? { ...(current.address || {}), ...payload.address } : current.address,
    branding: payload?.branding ? { ...(current.branding || {}), ...payload.branding } : current.branding,
  };
  const updated = await SchoolProfile.findOneAndUpdate(
    { key: 'default' },
    { $set: merged },
    { new: true, upsert: true }
  ).lean();
  const { _id, __v, ...rest } = updated;
  return rest;
};

exports.updateLogo = async (url) => {
  const updated = await SchoolProfile.findOneAndUpdate(
    { key: 'default' },
    { $set: { logo_url: url } },
    { new: true, upsert: true }
  ).lean();
  const { _id, __v, ...rest } = updated;
  return rest;
};
