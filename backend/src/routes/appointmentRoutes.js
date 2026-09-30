const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentByIdOrRef,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(createAppointment)
  .get(protect, getAppointments);

router.route('/:idOrRef')
  .get(getAppointmentByIdOrRef);

router.put('/:id/reschedule', protect, rescheduleAppointment);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/status', protect, updateAppointmentStatus);

module.exports = router;
