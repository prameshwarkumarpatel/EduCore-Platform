const router = require('express').Router();
const controller = require('../controllers/studentDashboardController');

router.get('/dashboard', controller.getDashboard);

module.exports = router;

