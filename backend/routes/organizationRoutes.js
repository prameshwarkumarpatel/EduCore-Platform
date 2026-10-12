const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organizationController');

router.get('/setup-data', orgController.getOrganizationSetupData);
router.post('/update-details', orgController.updateOrganizationDetails);
router.post('/hierarchy', orgController.addHierarchy);
router.post('/policies', orgController.addPolicy);

module.exports = router;
