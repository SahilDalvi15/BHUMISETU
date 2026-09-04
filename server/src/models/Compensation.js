const mongoose = require('mongoose');

const compensationSchema = new mongoose.Schema({
  compensationId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel', required: true },
  awardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Award' },
  
  // Financial breakdown
  marketValue: { type: Number, required: true },
  solatium: { type: Number, required: true }, // 100% of market value generally
  interest: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Beneficiary details
  beneficiaryName: { type: String, required: true },
  bankAccount: { type: String }, // Would be encrypted in real app
  ifscCode: { type: String },
  
  status: { type: String, enum: ['Assessed', 'Approved', 'Fund Transferred', 'Disbursed', 'Disputed'], default: 'Assessed' },
  
  disbursedDate: { type: Date },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Compensation', compensationSchema);
