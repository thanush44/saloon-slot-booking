const mongoose = require('mongoose');

const appointmentServiceItemSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      uppercase: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
    },
    services: {
      type: [appointmentServiceItemSchema],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'At least one service must be selected',
      },
    },
    stylist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stylist',
      required: [true, 'Stylist is required'],
    },
    date: {
      type: String, // Format: 'YYYY-MM-DD'
      required: [true, 'Date is required (YYYY-MM-DD)'],
      index: true,
    },
    startTime: {
      type: String, // Format: 'HH:MM' (24h)
      required: [true, 'Start time is required (HH:MM)'],
    },
    endTime: {
      type: String, // Format: 'HH:MM' (24h)
      required: [true, 'End time is required (HH:MM)'],
    },
    totalDurationMinutes: {
      type: Number,
      required: true,
      min: 10,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled', 'Completed', 'Rescheduled'],
      default: 'Confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate readable reference code if not set
appointmentSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.bookingReference = `SLN-${randomSuffix}`;
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
