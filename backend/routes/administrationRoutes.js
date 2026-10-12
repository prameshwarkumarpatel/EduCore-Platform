const express = require('express');
const router = express.Router();
const administrationController = require('../controllers/administrationController');

router.get('/dashboard-data', administrationController.getAdminDashboardData);

module.exports = router;
