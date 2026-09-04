const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Protected
exports.getProjects = async (req, res) => {
  try {
    // Basic RBAC filtering can be added here (e.g., State Officers only see their state's projects)
    let query = {};
    if (req.user.role === 'State Officer') {
      query.stateId = req.user.stateId;
    } else if (req.user.role === 'District Officer') {
      query.districtId = req.user.districtId;
    }

    const projects = await Project.find(query).populate('stateId districtId');
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Protected
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('stateId')
      .populate('districtId')
      .populate('villages');
      
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Protected (Admin / State Officers)
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
