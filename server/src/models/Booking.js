import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    venue: {
      type: String,
      enum: ['box-cricket', 'ground'],
      required: true,
      default: 'box-cricket',
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },

    slot: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },

    // =========================
    // PAYMENT DETAILS
    // =========================

    paymentStatus: {
      type: String,
      enum: [
        'pending',
        'paid',
        'failed',
        'refunded',
      ],
      default: 'pending',
      index: true,
    },

    paymentOrderId: {
      type: String,
      default: null,
      index: true,
    },

    paymentId: {
      type: String,
      default: null,
      index: true,
    },

    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Same slot can be booked separately for Box Cricket and Ground.
// But the same venue + date + slot cannot have two confirmed bookings.
bookingSchema.index(
  { venue: 1, date: 1, slot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: 'confirmed',
    },
  }
);

const Booking = mongoose.model(
  'Booking',
  bookingSchema
);

export default Booking;