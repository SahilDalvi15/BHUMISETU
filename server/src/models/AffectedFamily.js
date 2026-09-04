const mongoose = require('mongoose');

const affectedFamilySchema = new mongoose.Schema({
  familyId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel', required: true },
  
  headOfFamily: { type: String, required: true },
  numberOfMembers: { type: Number, required: true, default: 1 },
  
  category: { type: String, enum: ['Land Owner', 'Tenant', 'Agricultural Labourer', 'Artisan', 'Other'], required: true },
  incomeImpact: { type: String, enum: ['Primary', 'Secondary', 'Marginal'] },
  
  verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  rrEligibility: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('AffectedFamily', affectedFamilySchema);
