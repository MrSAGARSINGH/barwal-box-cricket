const API_URL =
  'https://barwal-box-cricket-1.onrender.com/api/bookings';

/* =========================
   CREATE BOOKING
========================= */

export const createBooking = async (bookingData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Unable to create booking.'
    );
  }

  return data.booking;
};

/* =========================
   GET BOOKINGS BY DATE + VENUE
========================= */

export const getBookingsByDate = async (
  date,
  venue
) => {
  if (!date) {
    return [];
  }

  const params = new URLSearchParams();

  params.set('date', date);

  if (venue) {
    params.set('venue', venue);
  }

  const response = await fetch(
    `${API_URL}/date?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Unable to fetch bookings.'
    );
  }

  return data.bookings || [];
};

/* =========================
   CHECK SLOT
========================= */

export const isSlotBooked = async (
  date,
  slot,
  venue
) => {
  const bookings =
    await getBookingsByDate(date, venue);

  return bookings.some(
    (booking) =>
      booking.slot === slot &&
      booking.status === 'confirmed'
  );
};

/* =========================
   CANCEL BOOKING
========================= */

export const cancelBooking = async (
  bookingId
) => {
  const token =
    sessionStorage.getItem(
      'barwal_admin_token'
    );

  if (!token) {
    throw new Error(
      'Admin authentication required.'
    );
  }

  const response = await fetch(
    `${API_URL}/admin/${bookingId}/cancel`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to cancel booking.'
    );
  }

  return data.booking;
};

/* =========================
   GET ALL BOOKINGS - ADMIN
========================= */

export const getAllBookings = async () => {
  const token =
    sessionStorage.getItem(
      'barwal_admin_token'
    );

  if (!token) {
    throw new Error(
      'Admin authentication required.'
    );
  }

  const response = await fetch(
    `${API_URL}/admin/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to fetch bookings.'
    );
  }

  return data.bookings || [];
};