const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/roles', userController.listRoles);

router.get('/', userController.listUsers);
router.post('/add', userController.addUser);
router.get('/:id', userController.getUserDetails);
router.put('/:id', userController.editUser);
router.delete('/:id', userController.removeUser);
router.patch('/:id/status', userController.toggleStatus);
router.patch('/:id/role', userController.assignRole);

module.exports = router;

