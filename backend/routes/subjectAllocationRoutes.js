const router = require('express').Router();
const controller = require('../controllers/subjectAllocationController');

router.get('/', controller.list);
router.get('/meta', controller.meta);
router.get('/workload', controller.workload);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/check-conflicts', controller.checkConflicts);

module.exports = router;

