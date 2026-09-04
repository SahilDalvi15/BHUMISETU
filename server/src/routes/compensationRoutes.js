const express = require('express');
const router = express.Router();
const { getCompensationsByProject, createCompensation } = require('../controllers/compFamController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/project/:projectId').get(getCompensationsByProject);
router.route('/').post(authorize('District Officer', 'State Officer'), createCompensation);

module.exports = router;
