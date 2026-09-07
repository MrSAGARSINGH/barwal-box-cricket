import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { useEffect, useState } from 'react';

import useBooking from '../hooks/useBooking';
import { createBookingWhatsAppUrl } from '../services/whatsappService';

import {
  createPaymentOrder,
  verifyPayment,
  loadRazorpayScript,
} from '../services/paymentService';

import { createBooking } from '../services/bookingService';

import './Booking.scss';

const slots = [
  '06:00 AM',
  '08:00 AM',
  '10:00 AM',
  '12:00 PM',
  '02:00 PM',
  '04:00 PM',
  '06:00 PM',
  '08:00 PM',
];

function Booking() {
  const {
    error,
    getBookedSlots,
  } = useBooking();

  /* =========================
     BOOKING STATE
  ========================= */

  const [venue, setVenue] = useState('box-cricket');

  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [slotError, setSlotError] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  /* =========================
     CUSTOM TIME STATE
  ========================= */

  const [customHour, setCustomHour] = useState('06');
  const [customMinute, setCustomMinute] = useState('30');
  const [customPeriod, setCustomPeriod] = useState('PM');
  const [showCustomTime, setShowCustomTime] = useState(false);

  const today = new Date()
    .toISOString()
    .split('T')[0];

  /* =========================
     VENUE DETAILS
  ========================= */

  const venueDetails = {
    'box-cricket': {
      label: 'BOX CRICKET',
      shortLabel: 'BOX CRICKET',
      description: 'Premium box cricket experience',
    },

    ground: {
      label: 'CRICKET GROUND',
      shortLabel: 'GROUND',
      description: 'Full ground booking experience',
    },
  };

  /* =========================
     CUSTOM TIME HELPERS
  ========================= */

  const getCustomTimeLabel = () =>
    `${customHour}:${customMinute} ${customPeriod}`;

  const handleCustomTime = () => {
    const formattedTime = getCustomTimeLabel();

    if (bookedSlots.includes(formattedTime)) {
      setSlotError(
        'This time has already been booked. Please choose another time.'
      );

      return;
    }

    setSelectedSlot(formattedTime);
    setShowCustomTime(false);
    setSlotError('');
  };

  /* =========================
     FETCH BOOKED SLOTS
  ========================= */

  useEffect(() => {
    let cancelled = false;

    const loadBookedSlots = async () => {
      if (!date) {
        setBookedSlots([]);
        return;
      }

      setSlotsLoading(true);
      setBookedSlots([]);
      setSelectedSlot('');

      setCustomHour('06');
      setCustomMinute('30');
      setCustomPeriod('PM');

      setShowCustomTime(false);
      setSlotError('');

      try {
        const result = await getBookedSlots(
          date,
          venue
        );

        if (!cancelled) {
          setBookedSlots(result);
        }
      } catch (err) {
        console.error(
          'Unable to load booked slots:',
          err
        );

        if (!cancelled) {
          setSlotError(
            'Unable to check slot availability. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      }
    };

    loadBookedSlots();

    return () => {
      cancelled = true;
    };
  }, [date, venue, getBookedSlots]);

  /* =========================
     VENUE SWITCH
  ========================= */

  const handleVenueChange = (selectedVenue) => {
    if (selectedVenue === venue) {
      return;
    }

    setVenue(selectedVenue);

    setSelectedSlot('');
    setBookedSlots([]);

    setCustomHour('06');
    setCustomMinute('30');
    setCustomPeriod('PM');

    setShowCustomTime(false);
    setSlotError('');
    setSuccess(false);
    setConfirmedBooking(null);
  };

  /* =========================
     DATE CHANGE
  ========================= */

  const handleDateChange = (event) => {
    setDate(event.target.value);

    setSelectedSlot('');

    setCustomHour('06');
    setCustomMinute('30');
    setCustomPeriod('PM');

    setShowCustomTime(false);
    setSuccess(false);
    setConfirmedBooking(null);
    setSlotError('');
  };

  /* =========================
     PHONE INPUT
  ========================= */

  const handlePhoneChange = (event) => {
    const value = event.target.value.replace(
      /\D/g,
      ''
    );

    if (value.length <= 10) {
      setPhone(value);
    }
  };

  /* =========================
     SELECT NORMAL SLOT
  ========================= */

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);

    setCustomHour('06');
    setCustomMinute('30');
    setCustomPeriod('PM');

    setShowCustomTime(false);
    setSlotError('');
  };

  /* =========================
     OPEN CUSTOM TIME
  ========================= */

  const handleOpenCustomTime = () => {
    setShowCustomTime(true);

    setSelectedSlot('');
    setSlotError('');
  };

  /* =========================
     PAY NOW + BOOK SLOT
  ========================= */

  const handleBooking = async (event) => {
    event.preventDefault();

    if (paymentLoading) {
      return;
    }

    if (!date) {
      alert('Please select a date.');
      return;
    }

    if (!selectedSlot) {
      alert('Please select a time slot.');
      return;
    }

    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    if (bookedSlots.includes(selectedSlot)) {
      alert(
        'This slot has already been booked. Please choose another slot.'
      );

      setSelectedSlot('');
      return;
    }

    try {
      setSlotError('');
      setPaymentLoading(true);

      /* =========================
         STEP 1
         CREATE PENDING BOOKING
      ========================= */

      const newBooking = await createBooking({
        venue,
        date,
        slot: selectedSlot,
        name: name.trim(),
        phone,
      });

      if (!newBooking?._id) {
        throw new Error(
          'Unable to create booking reference.'
        );
      }

      /* =========================
         STEP 2
         LOAD RAZORPAY
      ========================= */

      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          'Unable to load Razorpay Checkout. Please try again.'
        );
      }

      /* =========================
         STEP 3
         CREATE PAYMENT ORDER
      ========================= */

      const paymentData =
        await createPaymentOrder(
          newBooking._id
        );

      if (!paymentData?.order?.id) {
        throw new Error(
          'Unable to create payment order.'
        );
      }

      /* =========================
         STEP 4
         RAZORPAY CHECKOUT
      ========================= */

      const razorpayOptions = {
        key: import.meta.env
          .VITE_RAZORPAY_KEY_ID,

        amount:
          paymentData.order.amount,

        currency:
          paymentData.order.currency || 'INR',

        name: 'BARWAL BOX CRICKET',

        description:
          `${
            venue === 'box-cricket'
              ? 'Box Cricket'
              : 'Cricket Ground'
          } Booking`,

        order_id:
          paymentData.order.id,

        prefill: {
          name: name.trim(),
          contact: phone,
        },

        notes: {
          bookingId:
            newBooking.bookingId,

          venue,

          date,

          slot: selectedSlot,
        },

        theme: {
          color: '#b8ff3d',
        },

        /* =========================
           PAYMENT SUCCESS
        ========================= */

        handler: async (response) => {
          try {
            setSlotError('');

            /* =========================
               STEP 5
               VERIFY PAYMENT
            ========================= */

            const verified =
              await verifyPayment({
                bookingId:
                  newBooking._id,

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              });

            if (!verified?.success) {
              throw new Error(
                'Payment verification failed.'
              );
            }

            /* =========================
               STEP 6
               STORE CONFIRMED BOOKING
            ========================= */

            const finalBooking = {
              ...newBooking,

              paymentId:
                response.razorpay_payment_id,

              paymentStatus: 'paid',

              status: 'confirmed',
            };

            setConfirmedBooking(
              finalBooking
            );

            setPaymentLoading(false);
            setSuccess(true);

            /* =========================
               REFRESH SLOTS
            ========================= */

            try {
              const updatedSlots =
                await getBookedSlots(
                  date,
                  venue
                );

              setBookedSlots(
                updatedSlots
              );
            } catch (refreshError) {
              console.error(
                'Unable to refresh slots:',
                refreshError
              );
            }
          } catch (paymentError) {
            console.error(
              'Payment verification error:',
              paymentError
            );

            setPaymentLoading(false);

            setSlotError(
              paymentError.message ||
                'Payment verification failed. Please contact Barwal Box Cricket.'
            );
          }
        },

        /* =========================
           CHECKOUT CLOSED
        ========================= */

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);

            setSlotError(
              'Payment cancelled. Your booking is not confirmed.'
            );
          },
        },
      };

      /* =========================
         STEP 7
         OPEN RAZORPAY
      ========================= */

      if (!window.Razorpay) {
        throw new Error(
          'Razorpay Checkout is not available.'
        );
      }

      const razorpay =
        new window.Razorpay(
          razorpayOptions
        );

      /* =========================
         PAYMENT FAILED
      ========================= */

      razorpay.on(
        'payment.failed',
        (response) => {
          console.error(
            'Razorpay payment failed:',
            response?.error
          );

          setPaymentLoading(false);

          setSlotError(
            response?.error?.description ||
              'Payment failed. Please try again.'
          );
        }
      );

      razorpay.open();
    } catch (bookingError) {
      console.error(
        'Booking/payment error:',
        bookingError
      );

      setPaymentLoading(false);

      setSlotError(
        bookingError.message ||
          'Unable to start payment. Please try again.'
      );
    }
  };

  /* =========================
     WHATSAPP
  ========================= */

  const handleWhatsApp = () => {
    if (!confirmedBooking) {
      return;
    }

    window.open(
      createBookingWhatsAppUrl(
        confirmedBooking
      ),
      '_blank',
      'noopener,noreferrer'
    );
  };

  /* =========================
     NEW BOOKING
  ========================= */

  const handleNewBooking = () => {
    setSuccess(false);

    setConfirmedBooking(null);
    setPaymentLoading(false);

    setSelectedSlot('');

    setCustomHour('06');
    setCustomMinute('30');
    setCustomPeriod('PM');

    setShowCustomTime(false);

    setName('');
    setPhone('');

    setSlotError('');
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <section
      className="booking"
      id="booking"
    >
      <div className="booking__container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="booking__heading">
          <div>
            <span className="booking__eyebrow">
              <i />
              BOOK YOUR GAME
            </span>

            <h2>
              PICK YOUR
              <span>
                PERFECT SLOT.
              </span>
            </h2>
          </div>

          <p>
            Select your game space, choose your
            date and reserve your slot at Barwal
            Box Cricket.
          </p>
        </div>

        {/* =========================
            MAIN
        ========================= */}

        <div className="booking__main">

          {/* =========================
              LEFT INFO
          ========================= */}

          <aside className="booking__info">

            <div className="booking__info-top">
              <span>01</span>

              <div>
                <strong>BARWAL</strong>

                <small>
                  BOX CRICKET &amp; GROUND
                </small>
              </div>
            </div>

            <div className="booking__info-content">
              <span>
                READY TO PLAY?
              </span>

              <h3>
                YOUR
                <strong>
                  GAME AWAITS.
                </strong>
              </h3>

              <p>
                Choose your game space and preferred
                slot. Get your squad ready for the game.
              </p>
            </div>

            <div className="booking__info-list">

              <div>
                <Clock3 size={17} />

                <span>
                  <strong>
                    OPEN 24 HOURS
                  </strong>

                  Flexible playing hours
                </span>
              </div>

              <div>
                <MapPin size={17} />

                <span>
                  <strong>
                    GONER ROAD
                  </strong>

                  Jaipur, Rajasthan
                </span>
              </div>

              <div>
                <ShieldCheck size={17} />

                <span>
                  <strong>
                    {venueDetails[venue].label}
                  </strong>

                  {venueDetails[venue].description}
                </span>
              </div>

            </div>
          </aside>

          {/* =========================
              BOOKING FORM
          ========================= */}

          <form
            className="booking__form"
            onSubmit={handleBooking}
          >

            {/* =========================
                VENUE SWITCH
            ========================= */}

            <div className="booking__venue">

              <div className="booking__venue-head">

                <div className="booking__section-head">
                  <span>01</span>

                  <div>
                    <strong>
                      CHOOSE GAME SPACE
                    </strong>

                    <small>
                      Select what you want to book
                    </small>
                  </div>
                </div>

              </div>

              <div
                className="booking__venue-switch"
                role="tablist"
                aria-label="Choose game space"
              >

                <button
                  type="button"
                  role="tab"
                  aria-selected={
                    venue === 'box-cricket'
                  }
                  className={
                    venue === 'box-cricket'
                      ? 'booking__venue-option booking__venue-option--active'
                      : 'booking__venue-option'
                  }
                  onClick={() =>
                    handleVenueChange(
                      'box-cricket'
                    )
                  }
                >
                  <span className="booking__venue-icon">
                    🏏
                  </span>

                  <span>
                    <strong>
                      BOX CRICKET
                    </strong>

                    <small>
                      Premium box cricket
                    </small>
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={
                    venue === 'ground'
                  }
                  className={
                    venue === 'ground'
                      ? 'booking__venue-option booking__venue-option--active'
                      : 'booking__venue-option'
                  }
                  onClick={() =>
                    handleVenueChange(
                      'ground'
                    )
                  }
                >
                  <span className="booking__venue-icon">
                    🏟️
                  </span>

                  <span>
                    <strong>
                      CRICKET GROUND
                    </strong>

                    <small>
                      Full ground booking
                    </small>
                  </span>
                </button>

                <span
                  className={`booking__venue-slider ${
                    venue === 'ground'
                      ? 'booking__venue-slider--ground'
                      : ''
                  }`}
                />

              </div>
            </div>

            {/* =========================
                DATE
            ========================= */}

            <div className="booking__section">

              <div className="booking__section-head">
                <span>02</span>

                <div>
                  <strong>
                    SELECT DATE
                  </strong>

                  <small>
                    Choose your game day
                  </small>
                </div>
              </div>

              <label className="booking__date">

                <CalendarDays size={18} />

                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={handleDateChange}
                  required
                />

              </label>
            </div>

            {/* =========================
                SLOTS
            ========================= */}

            <div className="booking__section">

              <div className="booking__section-head">
                <span>03</span>

                <div>
                  <strong>
                    SELECT SLOT
                  </strong>

                  <small>
                    {!date
                      ? 'Select a date first'
                      : slotsLoading
                        ? 'Checking availability...'
                        : 'Choose an available time'}
                  </small>
                </div>
              </div>

              {slotError && (
                <div className="booking__error">
                  {slotError}
                </div>
              )}

              <div className="booking__slots">

                {/* =========================
                    NORMAL SLOTS
                ========================= */}

                {slots.map((slot) => {
                  const isBooked =
                    bookedSlots.includes(slot);

                  const isDisabled =
                    !date ||
                    slotsLoading ||
                    isBooked;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isDisabled}
                      className={`booking__slot ${
                        selectedSlot === slot
                          ? 'booking__slot--active'
                          : ''
                      } ${
                        isBooked
                          ? 'booking__slot--booked'
                          : ''
                      } ${
                        slotsLoading
                          ? 'booking__slot--loading'
                          : ''
                      }`}
                      onClick={() =>
                        handleSlotSelect(slot)
                      }
                    >
                      <span>
                        {slot}
                      </span>

                      {isBooked && (
                        <small>
                          BOOKED
                        </small>
                      )}

                      {!isBooked &&
                        selectedSlot === slot && (
                          <small>
                            SELECTED
                          </small>
                        )}
                    </button>
                  );
                })}

                {/* =========================
                    CUSTOM TIME BUTTON
                ========================= */}

                {!showCustomTime ? (
                  <button
                    type="button"
                    disabled={
                      !date ||
                      slotsLoading
                    }
                    className={`booking__slot booking__slot--custom ${
                      selectedSlot &&
                      !slots.includes(
                        selectedSlot
                      )
                        ? 'booking__slot--active'
                        : ''
                    }`}
                    onClick={
                      handleOpenCustomTime
                    }
                  >
                    <span className="booking__custom-icon">
                      +
                    </span>

                    <span className="booking__custom-label">
                      CUSTOM TIME
                    </span>

                    {selectedSlot &&
                      !slots.includes(
                        selectedSlot
                      ) && (
                        <small className="booking__custom-selected">
                          {selectedSlot}
                        </small>
                      )}
                  </button>
                ) : (
                  <div className="booking__custom-time">

                    <div className="booking__custom-heading">
                      <div>
                        <strong>
                          SET CUSTOM TIME
                        </strong>

                        <span>
                          Choose the exact time you want to play
                        </span>
                      </div>

                      <button
                        type="button"
                        className="booking__custom-close"
                        onClick={() => {
                          setShowCustomTime(
                            false
                          );
                          setSlotError('');
                        }}
                        aria-label="Close custom time picker"
                      >
                        ×
                      </button>
                    </div>

                    <div className="booking__custom-controls">

                      <div className="booking__custom-control">
                        <label htmlFor="custom-hour">
                          HOUR
                        </label>

                        <select
                          id="custom-hour"
                          value={customHour}
                          onChange={(event) => {
                            setCustomHour(
                              event.target.value
                            );
                            setSlotError('');
                          }}
                        >
                          {Array.from(
                            { length: 12 },
                            (_, index) => {
                              const hour =
                                String(
                                  index + 1
                                ).padStart(
                                  2,
                                  '0'
                                );

                              return (
                                <option
                                  value={hour}
                                  key={hour}
                                >
                                  {hour}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>

                      <span className="booking__custom-colon">
                        :
                      </span>

                      <div className="booking__custom-control">
                        <label htmlFor="custom-minute">
                          MINUTE
                        </label>

                        <select
                          id="custom-minute"
                          value={customMinute}
                          onChange={(event) => {
                            setCustomMinute(
                              event.target.value
                            );
                            setSlotError('');
                          }}
                        >
                          <option value="00">
                            00
                          </option>

                          <option value="15">
                            15
                          </option>

                          <option value="30">
                            30
                          </option>

                          <option value="45">
                            45
                          </option>
                        </select>
                      </div>

                      <div className="booking__custom-period">

                        <button
                          type="button"
                          className={
                            customPeriod === 'AM'
                              ? 'active'
                              : ''
                          }
                          onClick={() => {
                            setCustomPeriod(
                              'AM'
                            );
                            setSlotError('');
                          }}
                        >
                          AM
                        </button>

                        <button
                          type="button"
                          className={
                            customPeriod === 'PM'
                              ? 'active'
                              : ''
                          }
                          onClick={() => {
                            setCustomPeriod(
                              'PM'
                            );
                            setSlotError('');
                          }}
                        >
                          PM
                        </button>

                      </div>
                    </div>

                    <div className="booking__custom-preview">
                      <div>
                        <span>
                          YOUR CUSTOM SLOT
                        </span>

                        <small>
                          This time will be checked for availability
                        </small>
                      </div>

                      <strong>
                        {getCustomTimeLabel()}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="booking__custom-time-add"
                      onClick={
                        handleCustomTime
                      }
                    >
                      <span>
                        ADD {getCustomTimeLabel()} SLOT
                      </span>

                      <ArrowRight size={16} />
                    </button>

                  </div>
                )}

              </div>
            </div>

            {/* =========================
                DETAILS
            ========================= */}

            <div className="booking__section">

              <div className="booking__section-head">
                <span>04</span>

                <div>
                  <strong>
                    YOUR DETAILS
                  </strong>

                  <small>
                    Used for booking confirmation
                  </small>
                </div>
              </div>

              <div className="booking__fields">

                <label>
                  <UserRound size={16} />

                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    maxLength={50}
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  <span className="booking__country">
                    +91
                  </span>

                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={
                      handlePhoneChange
                    }
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    required
                  />
                </label>

              </div>
            </div>

            {/* =========================
                API ERROR
            ========================= */}

            {error && (
              <div className="booking__error">
                {error}
              </div>
            )}

            {/* =========================
                SUBMIT / SUCCESS
            ========================= */}

            {!success ? (
              <button
                type="submit"
                className="booking__submit"
                disabled={
                  paymentLoading ||
                  slotsLoading ||
                  !date ||
                  !selectedSlot ||
                  !name.trim() ||
                  phone.length !== 10
                }
              >
                {paymentLoading ? (
                  <>
                    PROCESSING...
                    <span className="booking__loader" />
                  </>
                ) : (
                  <>
                    PAY ₹1 &amp; BOOK
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <div className="booking__success">

                <div className="booking__success-icon">
                  <CheckCircle2 size={25} />
                </div>

                <div>
                  <strong>
                    BOOKING CONFIRMED
                  </strong>

                  <span>
                    Booking ID:{' '}
                    {confirmedBooking?.bookingId}
                  </span>

                  <small>
                    {confirmedBooking?.date}
                    {' · '}
                    {confirmedBooking?.slot}
                  </small>
                </div>

                <button
                  type="button"
                  onClick={
                    handleWhatsApp
                  }
                >
                  <MessageCircle size={17} />
                  SEND ON WHATSAPP
                </button>

                <button
                  type="button"
                  className="booking__new"
                  onClick={
                    handleNewBooking
                  }
                >
                  BOOK ANOTHER SLOT
                </button>

              </div>
            )}

          </form>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="booking__bottom">

          <div>
            <CheckCircle2 size={15} />

            <span>
              INSTANT SLOT CHECK
            </span>
          </div>

          <div>
            <ShieldCheck size={15} />

            <span>
              SAFE BOOKING
            </span>
          </div>

          <div>
            <MessageCircle size={15} />

            <span>
              WHATSAPP CONFIRMATION
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Booking;