const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  proposalId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  
  // Proposal Details
  title: { type: String, required: true },
  description: { type: String },
  landRequiredHectares: { type: Number, required: true },
  estimatedBudget: { type: Number },
  
  // Locations involved
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  villages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Village' }],
  
  // Lifecycle and Status
  status: {
    type: String,
    enum: [
      'Draft', 'Submitted', 'Under Verification', 'Under Scrutiny',
      'Returned', 'Clarification Required', 'Approved', 'Rejected'
    ],
    default: 'Draft'
  },
  
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nextAction: { type: String },
  
  documents: [{
    category: { type: String },
    fileUrl: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Auditing verification
  verificationHistory: [{
    officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    result: { type: String },
    remarks: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
