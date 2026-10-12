const router = require('express').Router();
const controller = require('../controllers/academicController');

router.get('/overview', controller.getOverview);
router.get('/curriculum', controller.getCurriculum);
router.get('/lesson-planning', controller.getLessonPlanning);
router.get('/homework', controller.getHomework);
router.get('/materials', controller.getMaterials);
router.get('/activities', controller.getActivities);
router.get('/insights', controller.getInsights);

module.exports = router;
