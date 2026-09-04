const express = require('express');
const router = express.Router();
const { getNotificationsByProject, createNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/project/:projectId').get(getNotificationsByProject);
router.route('/').post(authorize('National Admin', 'State Officer', 'District Officer'), createNotification);

module.exports = router;
