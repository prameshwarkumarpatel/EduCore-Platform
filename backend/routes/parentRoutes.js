const express = require('express');
const parentController = require('../controllers/parentController');

const router = express.Router();

router.get('/stats', parentController.getStats);
router.get('/linked-students', parentController.getLinkedStudents);
router.get('/recent-activities', parentController.getRecentActivities);
router.get('/communication-summary', parentController.getCommunicationSummary);
router.get('/pending-requests', parentController.getPendingRequests);
router.get('/alerts', parentController.getAlerts);
router.get('/search', parentController.search);

// Parent Directory
router.get('/directory', parentController.getDirectoryList);
router.get('/directory/export', parentController.exportDirectory);
router.get('/directory/:id', parentController.getParentDetails);
router.delete('/directory/:id', parentController.deleteParent);

// Parent Profile
router.put('/profile/:id', parentController.updateParentProfile);

module.exports = router;

