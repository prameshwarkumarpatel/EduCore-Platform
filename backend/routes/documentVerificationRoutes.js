const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentVerificationController');

router.get('/documents', controller.listDocuments);
router.get('/documents/pending-alerts', controller.pendingAlerts);
router.get('/documents/:id', controller.getDocumentDetails);
router.post('/documents/:id/approve', controller.approveDocument);
router.post('/documents/:id/reject', controller.rejectDocument);
router.patch('/documents/:id/status', controller.updateVerificationStatus);
router.patch('/documents/:id/remarks', controller.addRemarks);

module.exports = router;

