const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actionType: { type: String, required: true }, // e.g., 'CREATE', 'UPDATE', 'APPROVE', 'DELETE'
  entityModel: { type: String, required: true }, // e.g., 'Proposal', 'Project'
  entityId: { type: String, required: true },
  
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roleSnapshot: { type: String }, // Snapshot of the role at the time of action
  
  details: { type: String }, // e.g., "Status changed from Pending to Approved"
  ipAddress: { type: String }
}, { timestamps: true });

// Prevent modification of audit logs
auditLogSchema.pre('findOneAndUpdate', function(next) {
  next(new Error('Audit logs cannot be modified'));
});
auditLogSchema.pre('updateOne', function(next) {
  next(new Error('Audit logs cannot be modified'));
});
auditLogSchema.pre('remove', function(next) {
  next(new Error('Audit logs cannot be deleted'));
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
