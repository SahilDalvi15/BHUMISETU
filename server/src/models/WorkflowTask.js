const mongoose = require('mongoose');

const workflowTaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  
  // What is this task for?
  entityType: { type: String, enum: ['Project', 'Proposal', 'Notification', 'Award', 'Compensation', 'R&R', 'Possession'], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'entityType' },
  
  stage: { type: String, required: true },
  
  // Who owns it?
  assignedRole: { type: String, required: true },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // SLA & Timelines
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  dueDate: { type: Date, required: true },
  slaDays: { type: Number, required: true },
  
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Escalated'], default: 'Pending' },
  nextAction: { type: String },
  
  escalationLevel: { type: Number, default: 0 },
  escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  remarks: { type: String },
  completionDate: { type: Date }
}, { timestamps: true });

// Virtual to check if overdue
workflowTaskSchema.virtual('isOverdue').get(function() {
  if (this.status === 'Completed') return false;
  return new Date() > this.dueDate;
});

// Ensure virtuals are included in JSON responses
workflowTaskSchema.set('toJSON', { virtuals: true });
workflowTaskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('WorkflowTask', workflowTaskSchema);
