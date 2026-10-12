const express = require('express');
const controller = require('../controllers/staffController');

const router = express.Router();

router.get('/stats', controller.getStaffStats);
router.get('/workload', controller.getWorkload);
router.get('/attendance', controller.getAttendance);
router.get('/payroll-summary', controller.getPayrollSummary);
router.get('/activities', controller.getActivities);
router.get('/pending-tasks', controller.getPendingTasks);
router.get('/departments', controller.getDepartments);
router.post('/', controller.createStaff);
router.patch('/:id', controller.updateStaff);
router.post('/:id/photo', controller.uploadProfilePhoto);

module.exports = router;

