const mongoose = require('mongoose');

const possessionSchema = new mongoose.Schema({
  possessionId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel', required: true },
  
  handoverDate: { type: Date },
  acquiringAuthority: { type: String, required: true },
  
  status: { type: String, enum: ['Scheduled', 'In Progress', 'Possession Taken', 'Handed over to PIA'], default: 'Scheduled' },
  
  remarks: { type: String },
  documents: [{
    category: { type: String },
    fileUrl: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Possession', possessionSchema);
