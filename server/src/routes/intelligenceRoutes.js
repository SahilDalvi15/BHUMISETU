const express = require('express');
const router = express.Router();
const { getMISData, getRiskAssessment, getBottlenecks } = require('../controllers/intelligenceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/mis', getMISData);
router.get('/risk', authorize('National Admin', 'State Officer', 'Executive/Policy Viewer'), getRiskAssessment);
router.get('/bottlenecks', authorize('National Admin', 'State Officer', 'Executive/Policy Viewer'), getBottlenecks);

module.exports = router;
