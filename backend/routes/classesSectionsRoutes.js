const router = require('express').Router();
const controller = require('../controllers/classesSectionsController');

router.get('/dashboard', controller.dashboard);
router.post('/classes', controller.createClass);
router.patch('/classes/:id', controller.updateClass);
router.delete('/classes/:id', controller.deleteClass);
router.post('/sections', controller.createSection);
router.patch('/sections/:id', controller.updateSection);
router.delete('/sections/:id', controller.deleteSection);
router.post('/assign-teacher', controller.assignClassTeacher);
router.patch('/section-capacity', controller.updateSectionCapacity);

module.exports = router;
