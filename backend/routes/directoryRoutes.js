const router = require('express').Router();
const controller = require('../controllers/directoryController');

router.get('/filters', controller.filters);
router.get('/students', controller.listStudents);
router.get('/students/export', controller.exportCsv);
router.get('/students/:id', controller.getStudentProfile);

module.exports = router;

