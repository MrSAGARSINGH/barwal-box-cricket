const BARWAL_PHONE = '917820909090';

export const createBookingWhatsAppUrl = (booking) => {
  const message = `
Hi Barwal Box Cricket,

I want to confirm my booking.

Booking ID: ${booking.id}
Name: ${booking.name}
Phone: ${booking.phone}
Date: ${booking.date}
Slot: ${booking.slot}

Please confirm my booking.
  `.trim();

  return `https://wa.me/${BARWAL_PHONE}?text=${encodeURIComponent(
    message
  )}`;
};