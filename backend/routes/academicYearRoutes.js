const express = require('express');
const router = express.Router();
const academicYearController = require('../controllers/academicYearController');

router.get('/', academicYearController.listYears);
router.post('/', academicYearController.createYear);
router.get('/:id', academicYearController.getYearDetails);
router.put('/:id', academicYearController.updateYear);
router.delete('/:id', academicYearController.deleteYear);
router.patch('/:id/semesters', academicYearController.configureSemesters);
router.patch('/:id/status', academicYearController.toggleStatus);

module.exports = router;

