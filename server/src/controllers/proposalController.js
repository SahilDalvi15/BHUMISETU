const Proposal = require('../models/Proposal');
const WorkflowTask = require('../models/WorkflowTask'); // Will be created next

// @desc    Get all proposals
// @route   GET /api/proposals
// @access  Protected
exports.getProposals = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'State Officer') query.stateId = req.user.stateId;
    if (req.user.role === 'District Officer') query.districtId = req.user.districtId;

    const proposals = await Proposal.find(query).populate('projectId currentOwner stateId districtId');
    res.json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit a new proposal
// @route   POST /api/proposals
// @access  Protected
exports.submitProposal = async (req, res) => {
  try {
    // Generate a simple proposal ID
    const proposalId = `PROP-${Date.now().toString().slice(-6)}`;
    const newProposal = {
      ...req.body,
      proposalId,
      status: 'Submitted',
      submittedBy: req.user.id
    };

    const proposal = await Proposal.create(newProposal);
    res.status(201).json({ success: true, data: proposal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Verify Proposal
// @route   PUT /api/proposals/:id/verify
// @access  Protected
exports.verifyProposal = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'Not found' });

    proposal.status = status;
    proposal.verificationHistory.push({
      officer: req.user.id,
      role: req.user.role,
      result: status,
      remarks,
      timestamp: new Date()
    });

    await proposal.save();
    res.json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
