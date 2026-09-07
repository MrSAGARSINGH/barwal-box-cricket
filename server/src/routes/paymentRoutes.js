import express from 'express';

import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

// Create Razorpay payment order
router.post('/create-order', createPaymentOrder);

// Verify Razorpay payment
router.post('/verify', verifyPayment);

export default router;