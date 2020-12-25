const express = require('express');
const router = express();
const ctrl = require('../controllers/searchController');

router.get('/', ctrl.viewHomePage);
router.post('/fifthQuery', ctrl.postSearchFifthQuery);

module.exports = router;