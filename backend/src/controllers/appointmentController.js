const { Appointment, Service, Stylist } = require('../../../database');
const {
  timeToMinutes,
  addMinutesToTime,
  isOverlapping,
  getDayOfWeek,
  isTimeInPast,
} = require('../utils/timeUtils');

// @desc    Create / Book a new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      serviceIds,
      stylistId,
      date,
      startTime,
      notes,
    } = req.body;

    // 1. Validate required fields
    if (!customerName || !customerPhone || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone number, and email are required.',
      });
    }

    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one salon service.',
      });
    }

    if (!date || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Date and start time are required.',
      });
    }

    // 2. Validate date and time not in past
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr || isTimeInPast(date, startTime)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule an appointment for a past date or time.',
      });
    }

    // 3. Fetch services from database and compute total duration & price
    const services = await Service.find({ _id: { $in: serviceIds }, isActive: true });
    if (services.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected services are invalid or no longer active.',
      });
    }

    const totalDurationMinutes = services.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
    const endTime = addMinutesToTime(startTime, totalDurationMinutes);
    const dayOfWeek = getDayOfWeek(date);

    // 4. Resolve stylist assignment & verify conflict
    let assignedStylist = null;

    if (!stylistId || stylistId === 'any') {
      // Find all active stylists working on this day
      const eligibleStylists = await Stylist.find({
        isActive: true,
        daysOff: { $ne: dayOfWeek },
      });

      if (eligibleStylists.length === 0) {
        return res.status(400).json({
          success: false,
          message: `No stylists are scheduled to work on ${dayOfWeek}.`,
        });
      }

      // Check which stylist is free during [startTime, endTime)
      for (const st of eligibleStylists) {
        const workStartMin = timeToMinutes(st.workingHours?.start || '09:00');
        const workEndMin = timeToMinutes(st.workingHours?.end || '18:00');
        const startMin = timeToMinutes(startTime);
        const endMin = timeToMinutes(endTime);

        // Within stylist's working hours
        if (startMin >= workStartMin && endMin <= workEndMin) {
          const conflictingAppts = await Appointment.find({
            stylist: st._id,
            date,
            status: { $in: ['Confirmed', 'Rescheduled'] },
          });

          const hasConflict = conflictingAppts.some((appt) =>
            isOverlapping(startTime, endTime, appt.startTime, appt.endTime)
          );

          if (!hasConflict) {
            assignedStylist = st;
            break;
          }
        }
      }

      if (!assignedStylist) {
        return res.status(409).json({
          success: false,
          message: 'No available stylist found for this time slot. Please choose another time.',
        });
      }
    } else {
      // Specific stylist requested
      const stylist = await Stylist.findById(stylistId);
      if (!stylist || !stylist.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Selected stylist not found or is inactive.',
        });
      }

      if (stylist.daysOff.includes(dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: `${stylist.name} is off on ${dayOfWeek}s. Please choose another date or stylist.`,
        });
      }

      const workStartMin = timeToMinutes(stylist.workingHours?.start || '09:00');
      const workEndMin = timeToMinutes(stylist.workingHours?.end || '18:00');
      const startMin = timeToMinutes(startTime);
      const endMin = timeToMinutes(endTime);

      if (startMin < workStartMin || endMin > workEndMin) {
        return res.status(400).json({
          success: false,
          message: `Appointment window (${startTime} - ${endTime}) falls outside ${stylist.name}'s working hours (${stylist.workingHours.start} - ${stylist.workingHours.end}).`,
        });
      }

      // Check conflict for this stylist
      const conflictingAppts = await Appointment.find({
        stylist: stylist._id,
        date,
        status: { $in: ['Confirmed', 'Rescheduled'] },
      });

      const hasConflict = conflictingAppts.some((appt) =>
        isOverlapping(startTime, endTime, appt.startTime, appt.endTime)
      );

      if (hasConflict) {
        return res.status(409).json({
          success: false,
          message: `The selected time slot overlaps with an existing appointment for ${stylist.name}. Please select a different time slot.`,
        });
      }

      assignedStylist = stylist;
    }

    // 5. Construct appointment record
    const serviceItems = services.map((s) => ({
      serviceId: s._id,
      name: s.name,
      price: s.price,
      durationMinutes: s.durationMinutes,
    }));

    const appointment = new Appointment({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      services: serviceItems,
      stylist: assignedStylist._id,
      date,
      startTime,
      endTime,
      totalDurationMinutes,
      totalPrice,
      status: 'Confirmed',
      notes: notes || '',
    });

    await appointment.save();

    // Populate stylist for response
    const populated = await Appointment.findById(appointment._id).populate('stylist', 'name email phone avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: populated,
    });
  } catch (error) {
    console.error('[Appointment] Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message,
    });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
  try {
    const { date, status, stylistId, search } = req.query;
    const filter = {};

    if (date) {
      filter.date = date;
    }

    if (status) {
      filter.status = status;
    }

    if (stylistId) {
      filter.stylist = stylistId;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { customerName: searchRegex },
        { customerPhone: searchRegex },
        { customerEmail: searchRegex },
        { bookingReference: searchRegex },
      ];
    }

    const appointments = await Appointment.find(filter)
      .populate('stylist', 'name email phone avatarUrl')
      .sort({ date: -1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('[Appointment] Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments',
      error: error.message,
    });
  }
};

// @desc    Get appointment by ID or reference code
// @route   GET /api/appointments/:idOrRef
// @access  Public
const getAppointmentByIdOrRef = async (req, res) => {
  try {
    const { idOrRef } = req.params;

    let appointment;
    if (idOrRef.match(/^[0-9a-fA-F]{24}$/)) {
      appointment = await Appointment.findById(idOrRef).populate('stylist', 'name email phone avatarUrl');
    } else {
      appointment = await Appointment.findOne({
        bookingReference: idOrRef.toUpperCase(),
      }).populate('stylist', 'name email phone avatarUrl');
    }

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found. Please check your reference code or ID.',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment details',
      error: error.message,
    });
  }
};

// @desc    Reschedule appointment (Admin)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private/Admin
const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, stylistId } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (!date || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'New date and start time are required for rescheduling.',
      });
    }

    const targetStylistId = stylistId || appointment.stylist;
    const stylist = await Stylist.findById(targetStylistId);
    if (!stylist || !stylist.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Assigned stylist not found or inactive.',
      });
    }

    const dayOfWeek = getDayOfWeek(date);
    if (stylist.daysOff.includes(dayOfWeek)) {
      return res.status(400).json({
        success: false,
        message: `${stylist.name} is off on ${dayOfWeek}s.`,
      });
    }

    const endTime = addMinutesToTime(startTime, appointment.totalDurationMinutes);

    // Check conflict excluding current appointment
    const conflictingAppts = await Appointment.find({
      _id: { $ne: appointment._id },
      stylist: stylist._id,
      date,
      status: { $in: ['Confirmed', 'Rescheduled'] },
    });

    const hasConflict = conflictingAppts.some((appt) =>
      isOverlapping(startTime, endTime, appt.startTime, appt.endTime)
    );

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message: `Conflict detected! ${stylist.name} already has a booking overlapping with ${startTime} - ${endTime} on ${date}.`,
      });
    }

    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.stylist = stylist._id;
    appointment.status = 'Rescheduled';

    await appointment.save();

    const updated = await Appointment.findById(appointment._id).populate('stylist', 'name email phone avatarUrl');

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: updated,
    });
  } catch (error) {
    console.error('[Appointment] Reschedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule appointment',
      error: error.message,
    });
  }
};

// @desc    Cancel appointment (Admin or Customer)
// @route   PUT /api/appointments/:id/cancel
// @access  Public / Admin
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This appointment is already cancelled.',
      });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment has been cancelled.',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message,
    });
  }
};

// @desc    Update appointment status (Admin: Confirmed, Completed, Cancelled, Rescheduled)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Confirmed', 'Cancelled', 'Completed', 'Rescheduled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).populate('stylist', 'name email phone avatarUrl');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentByIdOrRef,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
};
