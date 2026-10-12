const router = require('express').Router();
const controller = require('../controllers/enrollmentController');

router.get('/classes', controller.classes);
router.get('/enrollments', controller.listEnrollments);
router.get('/enrollments/export', controller.exportCsv);
router.post('/enrollments/generate-id', controller.generateId);
router.post('/enrollments/convert', controller.convert);
router.patch('/enrollments/:id/assign', controller.assign);

module.exports = router;

