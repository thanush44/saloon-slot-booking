const mongoose = require('mongoose');

const stylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Stylist name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    specializations: {
      type: [String],
      default: ['Haircut & Styling'],
    },
    workingHours: {
      start: {
        type: String,
        required: true,
        default: '09:00', // 24-hr format "HH:MM"
      },
      end: {
        type: String,
        required: true,
        default: '18:00', // 24-hr format "HH:MM"
      },
    },
    daysOff: {
      type: [String],
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      default: ['Sunday'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Stylist', stylistSchema);
