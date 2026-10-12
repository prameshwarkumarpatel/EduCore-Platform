const router = require('express').Router();
const controller = require('../controllers/academicHistoryController');

router.get('/students/:studentId/dashboard', controller.dashboard);
router.get('/students/:studentId/gpa', controller.gpa);
router.get('/students/:studentId/grades', controller.grades);
router.get('/students/:studentId/subjects', controller.subjects);
router.get('/students/:studentId/history', controller.history);
router.post('/students/:studentId/transcript', controller.generateTranscript);
router.get('/students/:studentId/export', controller.export);

module.exports = router;

