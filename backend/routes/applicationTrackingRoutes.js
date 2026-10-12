const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicationTrackingController');

router.get('/applications', controller.listApplications);
router.get('/applications/:id', controller.getApplicationDetails);
router.patch('/applications/:id/status', controller.updateStatus);

module.exports = router;

