const router = require('express').Router();
const controller = require('../controllers/studentFormController');

router.get('/classes', controller.classes);
router.post('/validate', controller.validate);
router.post('/students', controller.create);
router.get('/students/:id', controller.getStudent);
router.put('/students/:id', controller.update);
router.post('/students/:id/photo', controller.uploadPhoto);

module.exports = router;

