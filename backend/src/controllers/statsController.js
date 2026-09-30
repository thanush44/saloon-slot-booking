const { Appointment, Service, Stylist } = require('../../../database');

// @desc    Get dashboard metrics and statistics
// @route   GET /api/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const [
      totalAppointments,
      todayAppointmentsCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      rescheduledCount,
      activeStylistsCount,
      totalServicesCount,
      allAppointments,
      recentAppointments,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ date: todayStr }),
      Appointment.countDocuments({ status: 'Confirmed' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.countDocuments({ status: 'Cancelled' }),
      Appointment.countDocuments({ status: 'Rescheduled' }),
      Stylist.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
      Appointment.find({ status: { $in: ['Confirmed', 'Completed'] } }),
      Appointment.find()
        .populate('stylist', 'name')
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    const totalRevenue = allAppointments.reduce((acc, appt) => acc + (appt.totalPrice || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        todayAppointmentsCount,
        totalRevenue,
        countsByStatus: {
          Confirmed: confirmedCount,
          Completed: completedCount,
          Cancelled: cancelledCount,
          Rescheduled: rescheduledCount,
        },
        activeStylistsCount,
        totalServicesCount,
        recentAppointments,
      },
    });
  } catch (error) {
    console.error('[Stats] Error computing dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
