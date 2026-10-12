const router = require('express').Router();
const controller = require('../controllers/staffAttendanceController');

router.get('/meta', controller.getMeta);
router.get('/daily', controller.getDaily);
router.get('/monthly', controller.getMonthly);
router.get('/report', controller.getReport);
router.get('/leave', controller.getLeaveData);
router.get('/alerts', controller.getAlerts);
router.post('/mark', controller.markAttendance);

module.exports = router;
