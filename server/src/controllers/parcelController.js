const Parcel = require('../models/Parcel');

// @desc    Get all parcels for a project
// @route   GET /api/parcels/project/:projectId
// @access  Protected
exports.getParcelsByProject = async (req, res) => {
  try {
    const parcels = await Parcel.find({ projectId: req.params.projectId })
      .populate('stateId districtId villageId');
    res.json({ success: true, count: parcels.length, data: parcels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single parcel intelligence details
// @route   GET /api/parcels/:id
// @access  Protected
exports.getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate('stateId districtId villageId projectId');
    
    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found' });
    }
    res.json({ success: true, data: parcel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add field verification to parcel
// @route   POST /api/parcels/:id/verify
// @access  Protected (Field Officer)
exports.verifyParcel = async (req, res) => {
  try {
    const { status, remarks, lat, lng } = req.body;
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) return res.status(404).json({ success: false, message: 'Parcel not found' });

    // Update GPS if provided
    if (lat && lng) {
      parcel.gpsCoordinates = { lat, lng };
    }

    parcel.fieldVerificationHistory.push({
      verifiedBy: req.user.id,
      status,
      remarks,
      timestamp: new Date()
    });

    await parcel.save();
    res.json({ success: true, data: parcel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
