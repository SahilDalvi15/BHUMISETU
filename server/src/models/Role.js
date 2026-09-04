const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: [{
    type: String
  }],
  level: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
