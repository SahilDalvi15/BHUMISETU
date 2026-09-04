const express = require('express');
const router = express.Router();
const { getMyInbox, completeTask } = require('../controllers/workflowController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/inbox').get(getMyInbox);
router.route('/:id/complete').put(completeTask);

module.exports = router;
