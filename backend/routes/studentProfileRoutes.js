const router = require('express').Router();
const controller = require('../controllers/studentProfileController');

router.get('/students/:id', controller.getProfile);
router.put('/students/:id', controller.updateProfile);
router.post('/students/:id/photo', controller.uploadPhoto);

module.exports = router;

