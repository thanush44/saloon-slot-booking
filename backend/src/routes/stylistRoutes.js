const express = require('express');
const router = express.Router();
const {
  getStylists,
  getStylistById,
  createStylist,
  updateStylist,
  deleteStylist,
} = require('../controllers/stylistController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getStylists)
  .post(protect, createStylist);

router.route('/:id')
  .get(getStylistById)
  .put(protect, updateStylist)
  .delete(protect, deleteStylist);

module.exports = router;
