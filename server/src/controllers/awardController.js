const Award = require('../models/Award');

exports.getAwardsByProject = async (req, res) => {
  try {
    const awards = await Award.find({ projectId: req.params.projectId }).populate('parcelId');
    res.json({ success: true, count: awards.length, data: awards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createAward = async (req, res) => {
  try {
    const awardId = `AWD-${Date.now().toString().slice(-6)}`;
    const award = await Award.create({ ...req.body, awardId });
    res.status(201).json({ success: true, data: award });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
