const API_URL =
  'https://barwal-box-cricket-1.onrender.com/api/payments';

/* =========================
   CREATE PAYMENT ORDER
========================= */

export const createPaymentOrder = async (
  bookingId
) => {
  const response = await fetch(
    `${API_URL}/create-order`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to create payment order.'
    );
  }

  return data;
};

/* =========================
   VERIFY PAYMENT
========================= */

export const verifyPayment = async ({
  bookingId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const response = await fetch(
    `${API_URL}/verify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Payment verification failed.'
    );
  }

  return data;
};

/* =========================
   LOAD RAZORPAY CHECKOUT
========================= */

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      existingScript.addEventListener(
        'load',
        () => resolve(true),
        { once: true }
      );

      existingScript.addEventListener(
        'error',
        () => resolve(false),
        { once: true }
      );

      return;
    }

    const script =
      document.createElement('script');

    script.src =
      'https://checkout.razorpay.com/v1/checkout.js';

    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};