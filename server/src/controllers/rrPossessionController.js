const RandR = require('../models/RandR');
const Possession = require('../models/Possession');

exports.getRRByProject = async (req, res) => {
  try {
    const records = await RandR.find({ projectId: req.params.projectId }).populate('familyId');
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createRR = async (req, res) => {
  try {
    const rrId = `RR-${Date.now().toString().slice(-6)}`;
    const record = await RandR.create({ ...req.body, rrId });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPossessionByProject = async (req, res) => {
  try {
    const records = await Possession.find({ projectId: req.params.projectId }).populate('parcelId');
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createPossession = async (req, res) => {
  try {
    const possessionId = `POS-${Date.now().toString().slice(-6)}`;
    const record = await Possession.create({ ...req.body, possessionId });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
