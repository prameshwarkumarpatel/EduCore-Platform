const schoolService = require('../services/schoolProfileService');

exports.getSchoolProfile = async (req, res) => {
  try {
    const profile = await schoolService.getProfile();
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSchoolProfile = async (req, res) => {
  try {
    const updated = await schoolService.updateProfileState(req.body);
    res.status(200).json({ message: "School profile updated successfully!", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    // In a real app, handle file upload to Cloudinary/S3
    const { url } = req.body;
    const updated = await schoolService.updateLogo(url);
    res.status(200).json({ message: "Logo updated!", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
