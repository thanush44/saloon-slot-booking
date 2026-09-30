const { Stylist } = require('../../../database');

// @desc    Get all stylists
// @route   GET /api/stylists
// @access  Public
const getStylists = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const filter = {};

    if (!includeInactive || includeInactive === 'false') {
      filter.isActive = true;
    }

    const stylists = await Stylist.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: stylists.length,
      data: stylists,
    });
  } catch (error) {
    console.error('[Stylists] Error fetching stylists:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stylists',
      error: error.message,
    });
  }
};

// @desc    Get single stylist by ID
// @route   GET /api/stylists/:id
// @access  Public
const getStylistById = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) {
      return res.status(404).json({
        success: false,
        message: 'Stylist not found',
      });
    }

    res.status(200).json({
      success: true,
      data: stylist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stylist details',
      error: error.message,
    });
  }
};

// @desc    Create new stylist
// @route   POST /api/stylists
// @access  Private/Admin
const createStylist = async (req, res) => {
  try {
    const { name, email, phone, bio, specializations, workingHours, daysOff, isActive, avatarUrl } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required fields',
      });
    }

    // Check if email already registered
    const existing = await Stylist.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A stylist with this email already exists',
      });
    }

    const stylist = await Stylist.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      bio: bio || '',
      specializations: Array.isArray(specializations) ? specializations : ['Haircut & Styling'],
      workingHours: {
        start: workingHours?.start || '09:00',
        end: workingHours?.end || '18:00',
      },
      daysOff: Array.isArray(daysOff) ? daysOff : ['Sunday'],
      isActive: isActive !== undefined ? isActive : true,
      avatarUrl: avatarUrl || '',
    });

    res.status(201).json({
      success: true,
      message: 'Stylist registered successfully',
      data: stylist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create stylist',
      error: error.message,
    });
  }
};

// @desc    Update stylist details, working hours, and days off
// @route   PUT /api/stylists/:id
// @access  Private/Admin
const updateStylist = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) {
      return res.status(404).json({
        success: false,
        message: 'Stylist not found',
      });
    }

    const updatedStylist = await Stylist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Stylist updated successfully',
      data: updatedStylist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update stylist',
      error: error.message,
    });
  }
};

// @desc    Delete stylist
// @route   DELETE /api/stylists/:id
// @access  Private/Admin
const deleteStylist = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) {
      return res.status(404).json({
        success: false,
        message: 'Stylist not found',
      });
    }

    await Stylist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Stylist removed successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete stylist',
      error: error.message,
    });
  }
};

module.exports = {
  getStylists,
  getStylistById,
  createStylist,
  updateStylist,
  deleteStylist,
};
