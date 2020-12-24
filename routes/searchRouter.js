const express = require('express');
const router = express();
const ctrl = require('../controllers/searchController');

router.get('/', ctrl.viewHomePage);

module.exports = router;