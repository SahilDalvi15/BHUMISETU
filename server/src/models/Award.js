const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  awardId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel', required: true },
  
  awardDate: { type: Date, required: true },
  awardAmount: { type: Number, required: true },
  authority: { type: String, required: true },
  
  status: { type: String, enum: ['Draft', 'Under Review', 'Approved', 'Disbursed'], default: 'Draft' },
  pendingActions: { type: String },
  remarks: { type: String },
  
  documents: [{
    category: { type: String },
    fileUrl: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Award', awardSchema);
