import crypto from 'crypto';
import Razorpay from 'razorpay';

import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

/* =========================================================
   RAZORPAY INSTANCE
   ---------------------------------------------------------
   Razorpay ko server startup par initialize nahi kar rahe.
   Keys available hone par hi instance create hoga.
========================================================= */

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error(
      'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    );

    error.code = 'RAZORPAY_NOT_CONFIGURED';

    throw error;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

/* =========================================================
   TEST PAYMENT AMOUNT
   ---------------------------------------------------------
   Client se Razorpay keys milne ke baad bhi abhi ₹1 test
   payment ke liye use hoga.
========================================================= */

const BOOKING_AMOUNT = 1;
const CURRENCY = 'INR';

/* =========================================================
   CREATE RAZORPAY ORDER
   POST /api/payments/create-order
========================================================= */

export const createPaymentOrder = async (req, res) => {
  try {
    /* -----------------------------------------------
       RAZORPAY CONFIG CHECK
    ----------------------------------------------- */

    const razorpay = getRazorpay();

    /* -----------------------------------------------
       GET BOOKING ID
    ----------------------------------------------- */

    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required.',
      });
    }

    /* -----------------------------------------------
       FIND BOOKING
    ----------------------------------------------- */

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    /* -----------------------------------------------
       BOOKING STATUS CHECK
    ----------------------------------------------- */

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled booking cannot be paid.',
      });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already confirmed.',
      });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been completed for this booking.',
      });
    }

    /* -----------------------------------------------
       CHECK EXISTING PAYMENT ORDER
    ----------------------------------------------- */

    const existingPayment = await Payment.findOne({
      booking: booking._id,
      status: {
        $in: ['created', 'authorized'],
      },
    });

    if (existingPayment) {
      return res.status(200).json({
        success: true,
        message: 'Payment order already exists.',
        order: {
          id: existingPayment.orderId,
          amount: existingPayment.amount,
          currency: existingPayment.currency,
        },
        payment: {
          id: existingPayment._id,
          status: existingPayment.status,
        },
      });
    }

    /* -----------------------------------------------
       FIXED ₹1 TEST AMOUNT

       1 Rupee = 100 Paise
    ----------------------------------------------- */

    const amountInPaise = BOOKING_AMOUNT * 100;

    /* -----------------------------------------------
       CREATE RAZORPAY ORDER
    ----------------------------------------------- */

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: CURRENCY,

      receipt: `barwal_${booking.bookingId}`,

      notes: {
        bookingId: booking._id.toString(),
        bookingReference: booking.bookingId,
        venue: booking.venue,
        date: booking.date,
        slot: booking.slot,
      },
    });

    /* -----------------------------------------------
       SAVE PAYMENT RECORD
    ----------------------------------------------- */

    const payment = await Payment.create({
      booking: booking._id,
      orderId: order.id,
      amount: amountInPaise,
      currency: CURRENCY,
      status: 'created',
    });

    /* -----------------------------------------------
       SAVE PAYMENT ORDER ON BOOKING
    ----------------------------------------------- */

    booking.paymentStatus = 'pending';

    booking.paymentOrderId = order.id;

    booking.amount = BOOKING_AMOUNT;

    booking.currency = CURRENCY;

    await booking.save();

    /* -----------------------------------------------
       SUCCESS RESPONSE
    ----------------------------------------------- */

    return res.status(201).json({
      success: true,

      message: 'Payment order created successfully.',

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },

      payment: {
        id: payment._id,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error(
      'Create payment order error:',
      error
    );

    /* -----------------------------------------------
       RAZORPAY KEYS NOT CONFIGURED
    ----------------------------------------------- */

    if (error.code === 'RAZORPAY_NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        message: error.message,
      });
    }

    /* -----------------------------------------------
       DUPLICATE PAYMENT / OTHER ERRORS
    ----------------------------------------------- */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Payment order already exists.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to create payment order.',
    });
  }
};

/* =========================================================
   VERIFY RAZORPAY PAYMENT
   POST /api/payments/verify
========================================================= */

export const verifyPayment = async (req, res) => {
  try {
    /* -----------------------------------------------
       RAZORPAY CONFIG CHECK
    ----------------------------------------------- */

    const razorpay = getRazorpay();

    /* -----------------------------------------------
       GET PAYMENT DATA
    ----------------------------------------------- */

    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    /* -----------------------------------------------
       VALIDATION
    ----------------------------------------------- */

    if (
      !bookingId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification details are incomplete.',
      });
    }

    /* -----------------------------------------------
       FIND PAYMENT RECORD
    ----------------------------------------------- */

    const payment = await Payment.findOne({
      booking: bookingId,
      orderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    /* -----------------------------------------------
       FIND BOOKING
    ----------------------------------------------- */

    const booking = await Booking.findById(
      bookingId
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    /* -----------------------------------------------
       CANCELLED BOOKING
    ----------------------------------------------- */

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled booking cannot be confirmed.',
      });
    }

    /* -----------------------------------------------
       ALREADY VERIFIED
    ----------------------------------------------- */

    if (
      payment.status === 'captured' &&
      booking.status === 'confirmed'
    ) {
      return res.status(200).json({
        success: true,
        message: 'Payment and booking are already confirmed.',
        booking,
        payment,
      });
    }

    /* =================================================
       SERVER-SIDE SIGNATURE VERIFICATION
    ================================================= */

    const generatedSignature = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${payment.orderId}|${razorpay_payment_id}`
      )
      .digest('hex');

    const generatedBuffer = Buffer.from(
      generatedSignature,
      'utf8'
    );

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      'utf8'
    );

    let isValidSignature = false;

    /* -----------------------------------------------
       SAFE SIGNATURE COMPARISON
    ----------------------------------------------- */

    if (
      generatedBuffer.length ===
      receivedBuffer.length
    ) {
      isValidSignature = crypto.timingSafeEqual(
        generatedBuffer,
        receivedBuffer
      );
    }

    /* -----------------------------------------------
       INVALID SIGNATURE
    ----------------------------------------------- */

    if (!isValidSignature) {
      payment.status = 'failed';

      payment.failureReason =
        'Invalid payment signature.';

      await payment.save();

      booking.paymentStatus = 'failed';

      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed.',
      });
    }

    /* =================================================
       FETCH PAYMENT FROM RAZORPAY
       -------------------------------------------------
       This confirms:
       1. Payment belongs to expected order
       2. Amount is correct
       3. Payment is captured
    ================================================= */

    const razorpayPayment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    /* -----------------------------------------------
       ORDER ID CHECK
    ----------------------------------------------- */

    if (
      razorpayPayment.order_id !==
      payment.orderId
    ) {
      payment.status = 'failed';

      payment.failureReason =
        'Payment does not belong to the expected order.';

      await payment.save();

      booking.paymentStatus = 'failed';

      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Payment order mismatch.',
      });
    }

    /* -----------------------------------------------
       AMOUNT CHECK
    ----------------------------------------------- */

    if (
      Number(razorpayPayment.amount) !==
      Number(payment.amount)
    ) {
      payment.status = 'failed';

      payment.failureReason =
        'Payment amount mismatch.';

      await payment.save();

      booking.paymentStatus = 'failed';

      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch.',
      });
    }

    /* -----------------------------------------------
       PAYMENT STATUS CHECK
    ----------------------------------------------- */

    if (
      razorpayPayment.status !==
      'captured'
    ) {
      payment.paymentId =
        razorpay_payment_id;

      payment.signature =
        razorpay_signature;

      payment.status = 'authorized';

      payment.failureReason =
        `Payment status: ${razorpayPayment.status}`;

      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment has not been captured yet.',
      });
    }

    /* =================================================
       SAVE CAPTURED PAYMENT
    ================================================= */

    payment.paymentId =
      razorpay_payment_id;

    payment.signature =
      razorpay_signature;

    payment.status = 'captured';

    payment.method =
      razorpayPayment.method || null;

    payment.failureReason = null;

    payment.paidAt = new Date();

    await payment.save();

    /* =================================================
       CONFIRM BOOKING
    ================================================= */

    booking.status = 'confirmed';

    booking.paymentStatus = 'paid';

    booking.paymentOrderId =
      payment.orderId;

    booking.paymentId =
      razorpay_payment_id;

    /* Payment.amount = paise
       Booking.amount = rupees */

    booking.amount =
      Number(payment.amount) / 100;

    booking.currency =
      payment.currency;

    booking.paidAt =
      payment.paidAt;

    await booking.save();

    /* =================================================
       SUCCESS RESPONSE
    ================================================= */

    return res.status(200).json({
      success: true,

      message:
        'Payment verified and booking confirmed.',

      booking,

      payment,
    });
  } catch (error) {
    console.error(
      'Verify payment error:',
      error
    );

    /* -----------------------------------------------
       RAZORPAY KEYS NOT CONFIGURED
    ----------------------------------------------- */

    if (error.code === 'RAZORPAY_NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to verify payment.',
    });
  }
};