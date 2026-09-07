import Booking from '../models/Booking.js';

const generateBookingId = () => {
  const timestamp = Date.now()
    .toString()
    .slice(-8);

  const random = Math.floor(
    100 + Math.random() * 900
  );

  return `BB-${timestamp}-${random}`;
};

const VALID_VENUES = ['box-cricket', 'ground'];

/* =========================
   CREATE BOOKING
   PAYMENT-FIRST FLOW

   Booking is created as PENDING.
   It becomes CONFIRMED only after
   successful Razorpay verification.
========================= */

export const createBooking = async (
  req,
  res
) => {
  try {
    const {
      venue,
      date,
      slot,
      name,
      phone,
    } = req.body;

    if (
      !venue ||
      !date ||
      !slot ||
      !name ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Venue, date, slot, name and phone are required.',
      });
    }

    if (!VALID_VENUES.includes(venue)) {
      return res.status(400).json({
        success: false,
        message:
          'Please select a valid booking venue.',
      });
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid name.',
      });
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          'Please enter a valid 10-digit phone number.',
      });
    }

    /* =========================
       CHECK CONFIRMED SLOT
    ========================= */

    const existingBooking =
      await Booking.findOne({
        venue,
        date,
        slot,
        status: 'confirmed',
      });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          'This slot has already been booked for the selected venue.',
      });
    }

    /* =========================
       CREATE PENDING BOOKING
    ========================= */

    const booking =
      await Booking.create({
        bookingId: generateBookingId(),
        venue,
        date,
        slot,
        name: cleanName,
        phone: cleanPhone,

        status: 'pending',

        paymentStatus: 'pending',
        paymentOrderId: null,
        paymentId: null,

        // Testing amount
        amount: 1,
        currency: 'INR',

        paidAt: null,
      });

    return res.status(201).json({
      success: true,
      message:
        'Booking reference created. Complete payment to confirm your slot.',
      booking,
    });
  } catch (error) {
    console.error(
      'Create Booking Error:',
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          'This slot has already been booked for the selected venue.',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Unable to create booking.',
    });
  }
};

/* =========================
   GET BOOKINGS BY DATE
   ONLY CONFIRMED BOOKINGS
========================= */

export const getBookingsByDate = async (
  req,
  res
) => {
  try {
    const {
      date,
      venue,
    } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required.',
      });
    }

    if (
      venue &&
      !VALID_VENUES.includes(venue)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide a valid booking venue.',
      });
    }

    const query = {
      date,
      status: 'confirmed',
    };

    if (venue) {
      query.venue = venue;
    }

    const bookings =
      await Booking.find(query).sort({
        slot: 1,
      });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      'Get Bookings Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to fetch bookings.',
    });
  }
};

/* =========================
   GET ALL BOOKINGS
   ADMIN
========================= */

export const getAllBookings = async (
  req,
  res
) => {
  try {
    const bookings =
      await Booking.find().sort({
        date: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      'Get All Bookings Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to fetch bookings.',
    });
  }
};

/* =========================
   CANCEL BOOKING
   ADMIN
========================= */

export const cancelBooking = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const booking =
      await Booking.findOne({
        bookingId: id,
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message:
          'Booking is already cancelled.',
      });
    }

    booking.status = 'cancelled';

    await booking.save();

    return res.status(200).json({
      success: true,
      message:
        'Booking cancelled successfully.',
      booking,
    });
  } catch (error) {
    console.error(
      'Cancel Booking Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to cancel booking.',
    });
  }
};