const Compensation = require('../models/Compensation');
const AffectedFamily = require('../models/AffectedFamily');

exports.getCompensationsByProject = async (req, res) => {
  try {
    const records = await Compensation.find({ projectId: req.params.projectId });
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createCompensation = async (req, res) => {
  try {
    const compensationId = `COMP-${Date.now().toString().slice(-6)}`;
    const record = await Compensation.create({ ...req.body, compensationId });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getFamiliesByProject = async (req, res) => {
  try {
    const families = await AffectedFamily.find({ projectId: req.params.projectId });
    res.json({ success: true, count: families.length, data: families });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createFamily = async (req, res) => {
  try {
    const familyId = `FAM-${Date.now().toString().slice(-6)}`;
    const family = await AffectedFamily.create({ ...req.body, familyId });
    res.status(201).json({ success: true, data: family });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
