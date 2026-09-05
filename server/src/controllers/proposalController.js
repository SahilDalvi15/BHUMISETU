const Proposal = require('../models/Proposal');
const WorkflowTask = require('../models/WorkflowTask');
const socketManager = require('../utils/socketManager');
require('../models/Project');
require('../models/State');
require('../models/District');
require('../models/User');

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
    console.error('Error in getProposals:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
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
    
    // Auto-create a workflow task for verification
    const workflowTask = await WorkflowTask.create({
      taskId: `WF-${Date.now().toString().slice(-6)}`,
      entityModel: 'Proposal',
      entityId: proposal._id,
      assignedRole: 'State Officer', // PRD flow: RB to State Officer
      stage: 'Initial Verification',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days SLA
    });

    // --- REAL-TIME INTEGRATION ---
    try {
      const io = socketManager.getIO();
      // Broadcast to all State Officers that a new workflow task has arrived
      io.to('State Officer').emit('NEW_WORKFLOW_TASK', {
        message: `New Proposal submitted for verification: ${proposal.proposalId}`,
        taskId: workflowTask.taskId
      });
      // Broadcast to global dashboard
      io.emit('DASHBOARD_UPDATE', { type: 'PROPOSAL_CREATED' });
    } catch(e) {
      console.log('Socket io not initialized in test/seed context');
    }

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

    // --- REAL-TIME INTEGRATION ---
    try {
      const io = socketManager.getIO();
      io.emit('DASHBOARD_UPDATE', { type: 'PROPOSAL_VERIFIED' });
    } catch(e) {}

    res.json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
