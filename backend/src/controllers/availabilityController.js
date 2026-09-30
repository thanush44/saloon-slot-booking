const { Stylist, Appointment } = require('../../../database');
const {
  timeToMinutes,
  minutesToTime,
  addMinutesToTime,
  isOverlapping,
  getDayOfWeek,
  isTimeInPast,
} = require('../utils/timeUtils');

// @desc    Get available booking slots for a specific date, duration, and stylist
// @route   GET /api/availability
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { date, duration, stylistId } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date query parameter is required (YYYY-MM-DD)',
      });
    }

    const durationMinutes = parseInt(duration, 10) || 30;
    const dayOfWeek = getDayOfWeek(date);

    // Verify date is not in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(200).json({
        success: true,
        date,
        dayOfWeek,
        slots: [],
        message: 'Cannot book appointments for past dates.',
      });
    }

    // Determine target stylists
    let targetStylists = [];
    if (!stylistId || stylistId === 'any') {
      // Find all active stylists who do NOT have this day in daysOff
      targetStylists = await Stylist.find({
        isActive: true,
        daysOff: { $ne: dayOfWeek },
      });

      if (targetStylists.length === 0) {
        return res.status(200).json({
          success: true,
          date,
          dayOfWeek,
          slots: [],
          message: `The salon has no stylists available on ${dayOfWeek}s.`,
        });
      }
    } else {
      const stylist = await Stylist.findById(stylistId);
      if (!stylist || !stylist.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Selected stylist was not found or is currently inactive',
        });
      }

      if (stylist.daysOff.includes(dayOfWeek)) {
        return res.status(200).json({
          success: true,
          date,
          dayOfWeek,
          slots: [],
          message: `${stylist.name} is off on ${dayOfWeek}s.`,
        });
      }

      targetStylists = [stylist];
    }

    // Map: slotStartTime -> array of available stylist IDs
    const slotMap = new Map();

    for (const stylist of targetStylists) {
      const workStartMin = timeToMinutes(stylist.workingHours?.start || '09:00');
      const workEndMin = timeToMinutes(stylist.workingHours?.end || '18:00');

      // Fetch stylist's active appointments for this date
      const existingAppointments = await Appointment.find({
        stylist: stylist._id,
        date: date,
        status: { $in: ['Confirmed', 'Rescheduled'] },
      });

      // Step in 30-minute intervals
      const stepMinutes = 30;
      for (let curr = workStartMin; curr + durationMinutes <= workEndMin; curr += stepMinutes) {
        const slotStart = minutesToTime(curr);
        const slotEnd = addMinutesToTime(slotStart, durationMinutes);

        // Skip if slot is already past today
        if (isTimeInPast(date, slotStart)) {
          continue;
        }

        // Check if overlaps with any appointment
        const hasConflict = existingAppointments.some((appt) =>
          isOverlapping(slotStart, slotEnd, appt.startTime, appt.endTime)
        );

        if (!hasConflict) {
          if (!slotMap.has(slotStart)) {
            slotMap.set(slotStart, []);
          }
          slotMap.get(slotStart).push({
            id: stylist._id,
            name: stylist.name,
          });
        }
      }
    }

    // Convert map to sorted slots list
    const sortedTimes = Array.from(slotMap.keys()).sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

    const availableSlots = sortedTimes.map((timeStr) => ({
      time: timeStr,
      availableStylists: slotMap.get(timeStr),
    }));

    return res.status(200).json({
      success: true,
      date,
      dayOfWeek,
      durationMinutes,
      stylistMode: !stylistId || stylistId === 'any' ? 'any' : 'specific',
      totalSlotsAvailable: availableSlots.length,
      slots: availableSlots,
    });
  } catch (error) {
    console.error('[Availability] Error calculating slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compute availability slots',
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableSlots,
};
