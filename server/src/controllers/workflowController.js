const WorkflowTask = require('../models/WorkflowTask');

// @desc    Get my workflow tasks (Inbox)
// @route   GET /api/workflows/inbox
// @access  Protected
exports.getMyInbox = async (req, res) => {
  try {
    const { status, priority, filter } = req.query;
    
    // Base query: Assigned to my exact user OR my role
    let query = {
      $or: [
        { assignedUser: req.user.id },
        { assignedRole: req.user.role, assignedUser: { $exists: false } }
      ]
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await WorkflowTask.find(query).populate('entityId');
    
    // Handle "overdue" custom filter via Javascript processing since it's a virtual/time-based
    let resultTasks = tasks;
    if (filter === 'overdue') {
      resultTasks = tasks.filter(t => t.isOverdue);
    } else if (filter === 'escalated') {
      resultTasks = tasks.filter(t => t.status === 'Escalated');
    }

    res.json({ success: true, count: resultTasks.length, data: resultTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Complete a workflow task
// @route   PUT /api/workflows/:id/complete
// @access  Protected
exports.completeTask = async (req, res) => {
  try {
    const { remarks } = req.body;
    const task = await WorkflowTask.findById(req.params.id);

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.status = 'Completed';
    task.completionDate = Date.now();
    task.remarks = remarks;
    task.assignedUser = req.user.id; // Record who actually completed it

    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
