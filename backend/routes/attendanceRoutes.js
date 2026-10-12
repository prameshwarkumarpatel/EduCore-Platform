const router = require('express').Router();
const controller = require('../controllers/attendanceController');

router.get('/filters', controller.filters);
router.get('/students', controller.students);
router.get('/logs', controller.logs);
router.get('/summary', controller.summary);
router.get('/trends', controller.trends);
router.get('/alerts/low', controller.lowAlerts);
router.get('/report', controller.report);
router.post('/mark', controller.mark);

module.exports = router;

