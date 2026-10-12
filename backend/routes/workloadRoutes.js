const router = require('express').Router();
const controller = require('../controllers/workloadController');

router.get('/data', controller.getWorkloadData);
router.get('/teaching-hours', controller.getTeachingHours);
router.get('/analysis', controller.analyzeWorkload);
router.get('/report', controller.generateWorkloadReport);
router.get('/meta', controller.getMeta);
router.post('/update', controller.updateWorkload);

module.exports = router;

