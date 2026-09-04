const express = require('express');
const router = express.Router();
const { getFamiliesByProject, createFamily } = require('../controllers/compFamController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/project/:projectId').get(getFamiliesByProject);
router.route('/').post(authorize('Field Officer', 'District Officer'), createFamily);

module.exports = router;
