const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('National Admin', 'Central Authority', 'State Officer', 'Land Requiring Body'), createProject);

router.route('/:id')
  .get(getProjectById);

module.exports = router;
