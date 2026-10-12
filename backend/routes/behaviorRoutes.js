const router = require('express').Router();
const controller = require('../controllers/behaviorController');

router.get('/filters', controller.filters);
router.get('/students', controller.students);
router.get('/incidents', controller.incidents);
router.get('/history', controller.history);
router.get('/notifications', controller.notifications);
router.post('/incidents/log', controller.logIncident);
router.post('/notify-parent', controller.notifyParent);
router.post('/report/generate', controller.generateReport);
router.get('/report/export', controller.exportReport);

module.exports = router;

