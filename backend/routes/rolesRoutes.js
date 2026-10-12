const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

router.get('/permissions', rolesController.fetchPermissions);

router.get('/', rolesController.listRoles);
router.post('/', rolesController.createRole);
router.get('/:id', rolesController.getRoleDetails);
router.put('/:id', rolesController.updateRole);
router.delete('/:id', rolesController.deleteRole);
router.post('/:id/permissions', rolesController.assignPermissions);

module.exports = router;

