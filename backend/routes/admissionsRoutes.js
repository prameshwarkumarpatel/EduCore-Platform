const express = require('express');
const router = express.Router();
const admissionsController = require('../controllers/admissionsController');

router.get('/dashboard', admissionsController.getDashboardData);
router.post('/applications', admissionsController.createApplication);
router.patch('/applications/:id/status', admissionsController.updateStatus);

module.exports = router;

