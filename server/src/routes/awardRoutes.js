const express = require('express');
const router = express.Router();
const { getAwardsByProject, createAward } = require('../controllers/awardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/project/:projectId').get(getAwardsByProject);
router.route('/').post(authorize('National Admin', 'State Officer', 'District Officer'), createAward);

module.exports = router;
