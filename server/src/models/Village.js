const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  // Optional geo-coordinates for the map integration
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Village', villageSchema);
