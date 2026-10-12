const router = require('express').Router();
const controller = require('../controllers/staffDirectoryController');

router.get('/', controller.list);
router.get('/search', controller.search);
router.get('/export', controller.exportCsv);
router.get('/:id', controller.details);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

