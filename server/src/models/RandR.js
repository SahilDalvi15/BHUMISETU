const mongoose = require('mongoose');

const rrSchema = new mongoose.Schema({
  rrId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'AffectedFamily', required: true },
  
  benefitType: { type: String, enum: ['Housing Plot', 'Built House', 'Annuity', 'Employment', 'One-time Financial Assistance'], required: true },
  details: { type: String }, // e.g., Address of new plot or amount
  
  status: { type: String, enum: ['Assessed', 'Approved', 'Distributed', 'Disputed'], default: 'Assessed' },
  authority: { type: String, required: true },
  
  disbursedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('RandR', rrSchema);
