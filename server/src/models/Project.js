const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Highway', 'Railway', 'Industrial', 'Irrigation', 'Urban', 'Renewable Energy', 'Other'] },
  purpose: { type: String },
  projectAuthority: { type: String },
  implementingAgency: { type: String },
  requiringBody: { type: String },
  acquiringAuthority: { type: String },
  
  // Geographic Location
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  villages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Village' }],
  
  // Estimates & Requirements
  requiredLandArea: { type: Number, description: 'In Hectares' },
  estimatedTimeline: { type: Number, description: 'In Months' },
  estimatedCompensation: { type: Number },
  estimatedAffectedFamilies: { type: Number },
  
  // Tracking
  stage: { 
    type: String, 
    enum: [
      'Proposed', 'Verified', 'Approved', 'Land Identified', 
      'Notified', 'Awarded', 'Compensation Assessment', 
      'R&R Processing', 'Possession Ready', 'Closed'
    ],
    default: 'Proposed'
  },
  progressPercentage: { type: Number, default: 0 },
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  
  // Timeline
  plannedStartDate: { type: Date },
  plannedEndDate: { type: Date },
  actualStartDate: { type: Date },
  actualEndDate: { type: Date },
  
  documents: [{
    category: { type: String },
    fileUrl: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
