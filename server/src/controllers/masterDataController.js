const State = require('../models/State');
const District = require('../models/District');
const Village = require('../models/Village');

// @desc    Get all states
// @route   GET /api/master/states
// @access  Protected
exports.getStates = async (req, res) => {
  try {
    const states = await State.find();
    res.json({ success: true, count: states.length, data: states });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get districts for a state
// @route   GET /api/master/states/:stateId/districts
// @access  Protected
exports.getDistrictsByState = async (req, res) => {
  try {
    const districts = await District.find({ stateId: req.params.stateId });
    res.json({ success: true, count: districts.length, data: districts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get villages for a district
// @route   GET /api/master/districts/:districtId/villages
// @access  Protected
exports.getVillagesByDistrict = async (req, res) => {
  try {
    const villages = await Village.find({ districtId: req.params.districtId });
    res.json({ success: true, count: villages.length, data: villages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
