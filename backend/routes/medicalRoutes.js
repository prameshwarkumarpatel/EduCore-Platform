const router = require('express').Router();
const controller = require('../controllers/medicalController');

router.get('/students/:studentId/dashboard', controller.dashboard);

// medical history
router.get('/students/:studentId/history', controller.historyList);
router.post('/students/:studentId/history', controller.historyAdd);
router.put('/students/:studentId/history/:recordId', controller.historyUpdate);
router.delete('/students/:studentId/history/:recordId', controller.historyDelete);

// immunizations
router.get('/students/:studentId/immunizations', controller.immunizations);
router.post('/students/:studentId/immunizations', controller.immunizationsAdd);
router.put('/students/:studentId/immunizations/:immunizationId', controller.immunizationsUpdate);
router.delete('/students/:studentId/immunizations/:immunizationId', controller.immunizationsDelete);

// allergies
router.get('/students/:studentId/allergies', controller.allergies);
router.post('/students/:studentId/allergies', controller.allergiesAdd);
router.put('/students/:studentId/allergies/:allergyId', controller.allergiesUpdate);
router.delete('/students/:studentId/allergies/:allergyId', controller.allergiesDelete);

// emergency contacts
router.get('/students/:studentId/emergency-contacts', controller.emergencyContacts);
router.post('/students/:studentId/emergency-contacts', controller.emergencyContactsAdd);
router.delete('/students/:studentId/emergency-contacts/:contactId', controller.emergencyContactsDelete);

// documents
router.get('/students/:studentId/documents', controller.documents);
router.post('/students/:studentId/documents/upload', controller.documentsUpload);
router.get('/documents/:docId', controller.documentById);

module.exports = router;

