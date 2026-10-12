const router = require('express').Router();
const controller = require('../controllers/departmentController');

router.get('/', controller.list);
router.get('/staff-pool', controller.staffPool);
router.get('/:id', controller.details);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/assign-staff', controller.assignStaff);

module.exports = router;

