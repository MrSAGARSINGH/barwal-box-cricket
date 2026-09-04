import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      index: true,
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
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index(
  { date: 1, slot: 1 },
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