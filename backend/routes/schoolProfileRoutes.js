const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolProfileController');

router.get('/', schoolController.getSchoolProfile);
router.post('/update', schoolController.updateSchoolProfile);
router.post('/upload-logo', schoolController.uploadLogo);

module.exports = router;
