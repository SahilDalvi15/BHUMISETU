const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: [
      'National Admin',
      'Central Authority',
      'State Officer',
      'District Officer',
      'Land Requiring Body',
      'Land Acquiring Authority',
      'Project Implementing Agency',
      'Rehabilitation Authority',
      'Field Officer',
      'Executive Viewer'
    ]
  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
