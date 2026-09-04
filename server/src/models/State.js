const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g., MH, UP
  name: { type: String, required: true },
  region: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);
