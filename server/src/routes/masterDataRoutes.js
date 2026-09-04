const express = require('express');
const router = express.Router();
const { getStates, getDistrictsByState, getVillagesByDistrict } = require('../controllers/masterDataController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/states').get(getStates);
router.route('/states/:stateId/districts').get(getDistrictsByState);
router.route('/districts/:districtId/villages').get(getVillagesByDistrict);

module.exports = router;
