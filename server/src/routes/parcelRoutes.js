const express = require('express');
const router = express.Router();
const { getParcelsByProject, getParcelById, verifyParcel } = require('../controllers/parcelController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/project/:projectId').get(getParcelsByProject);
router.route('/:id').get(getParcelById);

// Field operations route
router.route('/:id/verify')
  .post(authorize('Field Officer', 'District Officer'), verifyParcel);

module.exports = router;
