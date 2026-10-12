const express = require('express');
const controller = require('../controllers/linkedStudentsController');

const router = express.Router({ mergeParams: true });

router.get('/', controller.getLinkedStudents);
router.get('/search', controller.searchStudents);
router.get('/student/:studentId', controller.getStudentDetails);
router.post('/', controller.linkStudent);
router.delete('/:studentId', controller.unlinkStudent);
router.patch('/:studentId/relationship', controller.updateRelationshipType);

module.exports = router;
