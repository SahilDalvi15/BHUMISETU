const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
  parcelId: { type: String, required: true, unique: true }, // e.g., MH-THN-PRJ001-P00045
  surveyNumber: { type: String, required: true },
  
  // Geography
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  
  // Details
  area: { type: Number, required: true }, // in Hectares
  landType: { type: String, enum: ['Agricultural', 'Commercial', 'Residential', 'Barren', 'Forest'] },
  
  // Progress Lifecycle tracking
  acquisitionStatus: { type: String, enum: ['Identified', 'Notified', 'Awarded', 'Possession Taken'], default: 'Identified' },
  notificationStatus: { type: String, enum: ['Pending', 'Issued'], default: 'Pending' },
  awardStatus: { type: String, enum: ['Pending', 'Declared'], default: 'Pending' },
  
  // Compensation tracking
  compensationAssessed: { type: Number, default: 0 },
  compensationApproved: { type: Number, default: 0 },
  compensationDisbursed: { type: Number, default: 0 },
  
  familyCount: { type: Number, default: 0 },
  rrStatus: { type: String, enum: ['Not Required', 'Pending', 'In Progress', 'Completed'], default: 'Pending' },
  possessionStatus: { type: String, enum: ['Not Ready', 'Ready', 'Scheduled', 'Possession Taken', 'Handover Completed'], default: 'Not Ready' },
  
  // Intelligence & Alerts
  riskScore: { type: Number, default: 0 },
  primaryBlocker: { type: String },
  responsibleAuthority: { type: String },
  
  // GIS 
  gpsCoordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  documents: [{
    category: { type: String },
    fileUrl: { type: String }
  }],
  
  fieldVerificationHistory: [{
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    remarks: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Parcel', parcelSchema);
