const express = require('express');
const router = express.Router();
const { getRRByProject, createRR } = require('../controllers/rrPossessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/project/:projectId').get(getRRByProject);
router.route('/').post(authorize('Rehabilitation Authority', 'District Officer'), createRR);

module.exports = router;
