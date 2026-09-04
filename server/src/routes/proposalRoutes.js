const express = require('express');
const router = express.Router();
const { getProposals, submitProposal, verifyProposal } = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProposals)
  .post(authorize('Land Requiring Body', 'Project Implementing Agency'), submitProposal);

router.route('/:id/verify')
  .put(authorize('State Officer', 'District Officer', 'National Admin'), verifyProposal);

module.exports = router;
