const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branchesController');

router.get('/', branchesController.listBranches);
router.post('/add', branchesController.addBranch);
router.put('/:id', branchesController.editBranch);
router.delete('/:id', branchesController.removeBranch);
router.post('/assign', branchesController.assignUsers);

module.exports = router;
