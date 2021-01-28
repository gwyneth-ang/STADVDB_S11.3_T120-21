const express = require('express');
const router = express();
const ctrl = require('../controllers/searchController');

router.get('/', ctrl.viewHomePage);
router.post('/sliceQuery', ctrl.postSliceQuery);

// router.post('/actorNamesQuery', ctrl.postActorNamesQuery);
// router.post('/firstQuery', ctrl.postSearchFirstQuery);
// router.post('/secondQuery', ctrl.postSearchSecondQuery);
// router.post('/thirdQuery', ctrl.postSearchThirdQuery);
// router.post('/fourthQuery', ctrl.postSearchFourthQuery);
// router.post('/fifthQuery', ctrl.postSearchFifthQuery);
// router.post('/sixthQuery', ctrl.postSearchSixthQuery);
// router.post('/seventhQuery', ctrl.postSearchSeventhQuery);



module.exports = router;