import {
  useCallback,
  useState,
} from 'react';

import {
  createBooking,
  getBookingsByDate,
} from '../services/bookingService';

function useBooking() {
  const [loading, setLoading] =
    useState(false);

  const [booking, setBooking] =
    useState(null);

  const [error, setError] =
    useState('');

  /* =========================
     GET BOOKED SLOTS
  ========================= */

  const getBookedSlots = useCallback(
    async (date, venue) => {
      if (!date) {
        return [];
      }

      try {
        const bookings =
          await getBookingsByDate(
            date,
            venue
          );

        return bookings
          .filter(
            (item) =>
              item.status !== 'cancelled'
          )
          .map(
            (item) => item.slot
          );
      } catch (err) {
        console.error(
          'Get booked slots error:',
          err
        );

        throw err;
      }
    },
    []
  );

  /* =========================
     BOOK SLOT
  ========================= */

  const bookSlot = async (
    bookingData
  ) => {
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const result =
        await createBooking(
          bookingData
        );

      setBooking(result);

      return {
        success: true,
        booking: result,
      };
    } catch (err) {
      const message =
        err.message ||
        'Unable to complete booking.';

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    booking,
    error,
    bookSlot,
    getBookedSlots,
  };
}

export default useBooking;