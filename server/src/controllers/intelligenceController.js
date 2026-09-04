const Project = require('../models/Project');
const WorkflowTask = require('../models/WorkflowTask');
const Compensation = require('../models/Compensation');

// @desc    Get Global MIS Overview
// @route   GET /api/intelligence/mis
// @access  Protected
exports.getMISData = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const projects = await Project.find();
    const totalArea = projects.reduce((acc, p) => acc + (p.requiredLandArea || 0), 0);

    const compensations = await Compensation.find();
    const totalDisbursed = compensations
      .filter(c => c.status === 'Disbursed')
      .reduce((acc, c) => acc + (c.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalProjects,
        totalAreaRequired: totalArea,
        totalCompensationDisbursed: totalDisbursed
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Calculate Project Risk & Delay Predictions
// @route   GET /api/intelligence/risk
// @access  Protected
exports.getRiskAssessment = async (req, res) => {
  try {
    // Risk is calculated dynamically based on overdue tasks
    const allTasks = await WorkflowTask.find({ status: { $ne: 'Completed' } });
    const now = new Date();

    const highRiskTasks = allTasks.filter(t => new Date(t.dueDate) < now); // Overdue
    const mediumRiskTasks = allTasks.filter(t => {
      const diff = new Date(t.dueDate) - now;
      return diff > 0 && diff < (3 * 24 * 60 * 60 * 1000); // Due in less than 3 days
    });

    res.json({
      success: true,
      data: {
        totalPendingTasks: allTasks.length,
        highRiskSLA: highRiskTasks.length,
        mediumRiskSLA: mediumRiskTasks.length,
        systemHealth: highRiskTasks.length > 5 ? 'Critical' : 'Stable'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Identify Administrative Bottlenecks
// @route   GET /api/intelligence/bottlenecks
// @access  Protected
exports.getBottlenecks = async (req, res) => {
  try {
    const overdueTasks = await WorkflowTask.find({ 
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() }
    });

    // Group overdue tasks by assigned Role to find the bottleneck
    const roleBacklogs = {};
    overdueTasks.forEach(t => {
      roleBacklogs[t.assignedRole] = (roleBacklogs[t.assignedRole] || 0) + 1;
    });

    // Generate dynamic recommendations
    const recommendations = [];
    Object.keys(roleBacklogs).forEach(role => {
      if (roleBacklogs[role] >= 2) {
        recommendations.push(`Reallocate resources or escalate tasks assigned to: ${role} (Backlog: ${roleBacklogs[role]})`);
      }
    });

    res.json({
      success: true,
      data: {
        bottlenecksByRole: roleBacklogs,
        automatedRecommendations: recommendations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
