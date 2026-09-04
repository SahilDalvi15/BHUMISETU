const express = require('express');
const router = express.Router();
const { getDocuments, uploadDocument } = require('../controllers/auditDocController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:entityModel/:entityId', getDocuments);
router.post('/', uploadDocument);

module.exports = router;
