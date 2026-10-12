const router = require('express').Router();
const controller = require('../controllers/leaveController');

router.get('/filters', controller.filters);
router.get('/students', controller.students);

router.get('/requests', controller.requests);
router.get('/history', controller.history);

router.post('/requests', controller.submit);
router.post('/requests/:requestId/approve', controller.approve);
router.post('/requests/:requestId/reject', controller.reject);

router.get('/notifications', controller.notifications);
router.post('/notify', controller.notifyParent);

router.post('/report/generate', controller.reportGenerate);
router.get('/report/export', controller.reportExport);

module.exports = router;

