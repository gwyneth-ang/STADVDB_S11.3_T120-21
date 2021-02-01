const express = require('express');
const router = express();
const ctrl = require('../controllers/searchController');

router.get('/', ctrl.viewHomePage);

router.post('/rollUpQuery', ctrl.postRollUpQuery);
router.post('/drillDownQuery', ctrl.postDrillDownQuery);
router.post('/diceQuery', ctrl.postDiceQuery);
router.post('/sliceQuery', ctrl.postSliceQuery);

router.post('/countriesQuery', ctrl.postCountriesQuery);
router.post('/genreQuery', ctrl.postGenreQuery);

module.exports = router;