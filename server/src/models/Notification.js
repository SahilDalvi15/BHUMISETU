const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  
  notificationType: { type: String, enum: ['Section 11 (Preliminary)', 'Section 19 (Declaration)', 'Section 21 (Notice to Persons Interested)'], required: true },
  dateIssued: { type: Date, required: true },
  authority: { type: String, required: true },
  
  areaCoveredHectares: { type: Number },
  villagesCovered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Village' }],
  
  status: { type: String, enum: ['Draft', 'Under Review', 'Published'], default: 'Draft' },
  remarks: { type: String },
  
  documents: [{
    category: { type: String },
    fileUrl: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
