const express = require('express');
const router = express.Router();
const controller = require('../controllers/approvalController');

router.get('/queue', controller.queue);
router.get('/classes', controller.classes);
router.get('/applications/:id', controller.review);
router.post('/applications/:id/assign', controller.assign);
router.post('/applications/:id/approve', controller.approve);
router.post('/applications/:id/reject', controller.reject);
router.post('/applications/:id/confirmation', controller.confirmation);
router.post('/applications/:id/notify', controller.notify);
router.get('/applications/:id/history', controller.history);

module.exports = router;

