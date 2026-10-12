const express = require('express');
const controller = require('../controllers/communicationController');

const router = express.Router({ mergeParams: true });

// History (single parent)
router.get('/:parentId/communication/messages', controller.getMessages);
router.get('/:parentId/communication/calls', controller.getCalls);
router.get('/:parentId/communication/notifications', controller.getNotifications);

// Send (single parent)
router.post('/:parentId/communication/send', controller.sendMessage);

// Broadcast (multiple parents)
router.post('/communication/broadcast', controller.broadcast);

module.exports = router;

