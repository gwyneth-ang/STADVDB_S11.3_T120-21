const express = require('express');
const router = express();
const ctrl = require('../controllers/searchController');

router.get('/', ctrl.viewHomePage);
router.post('/secondQuery', ctrl.postSearchSecondQuery);
router.post('/thirdQuery', ctrl.postSearchThirdQuery);
router.post('/fourthQuery', ctrl.postSearchFourthQuery);
router.post('/fifthQuery', ctrl.postSearchFifthQuery);
router.post('/sixthQuery', ctrl.postSearchSixthQuery);

module.exports = router;