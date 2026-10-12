const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/overview', dashboardController.getOverview);
router.get('/kpi', dashboardController.getKPIMetrics);
router.get('/activities', dashboardController.getRecentActivities);
router.get('/notifications', dashboardController.getNotifications);
router.post('/quick-actions', dashboardController.handleQuickAction);
router.patch('/notifications/:id/read', dashboardController.markNotificationRead);

module.exports = router;
