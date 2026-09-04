const express = require('express');
const router = express.Router();
const { getPossessionByProject, createPossession } = require('../controllers/rrPossessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/project/:projectId').get(getPossessionByProject);
router.route('/').post(authorize('Land Acquiring Authority', 'District Officer'), createPossession);

module.exports = router;
