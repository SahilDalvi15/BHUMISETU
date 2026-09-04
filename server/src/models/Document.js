const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  entityModel: { type: String, required: true }, // e.g., 'Project', 'Parcel', 'Proposal'
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  
  title: { type: String, required: true },
  category: { type: String, enum: ['Notification', 'Survey', 'Award', 'Verification', 'Other'], required: true },
  
  fileUrl: { type: String, required: true },
  version: { type: Number, default: 1 },
  
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  history: [{
    version: Number,
    fileUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
