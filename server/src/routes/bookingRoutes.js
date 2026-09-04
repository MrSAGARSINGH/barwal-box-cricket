import express from 'express';

import {
  createBooking,
  getBookingsByDate,
  getAllBookings,
  cancelBooking,
} from '../controllers/bookingController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/* Public */

router.post(
  '/',
  createBooking
);

router.get(
  '/date',
  getBookingsByDate
);

/* Admin protected */

router.get(
  '/admin/all',
  authMiddleware,
  getAllBookings
);

router.patch(
  '/admin/:id/cancel',
  authMiddleware,
  cancelBooking
);

export default router;