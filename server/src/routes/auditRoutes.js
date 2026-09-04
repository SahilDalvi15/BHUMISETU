const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditDocController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:entityModel/:entityId', getAuditLogs);

module.exports = router;
