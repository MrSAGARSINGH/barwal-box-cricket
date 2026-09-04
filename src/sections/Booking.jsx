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
    loading,
    booking,
    error,
    bookSlot,
    getBookedSlots,
  } = useBooking();

  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [slotError, setSlotError] = useState('');

  const today = new Date()
    .toISOString()
    .split('T')[0];

  /*
   * FETCH BOOKED SLOTS FROM MONGODB
   */
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
      setSlotError('');

      try {
        const result = await getBookedSlots(date);

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
  }, [date, getBookedSlots]);

  /*
   * RESET SUCCESS STATE WHEN DATE CHANGES
   */
  useEffect(() => {
    setSuccess(false);
  }, [date]);

  /*
   * PHONE INPUT
   */
  const handlePhoneChange = (event) => {
    const value = event.target.value.replace(
      /\D/g,
      ''
    );

    if (value.length <= 10) {
      setPhone(value);
    }
  };

  /*
   * DATE CHANGE
   */
  const handleDateChange = (event) => {
    setDate(event.target.value);
    setSelectedSlot('');
    setSuccess(false);
    setSlotError('');
  };

  /*
   * BOOK SLOT
   */
  const handleBooking = async (event) => {
    event.preventDefault();

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
      alert(
        'Please enter a valid 10-digit phone number.'
      );
      return;
    }

    /*
     * EXTRA FRONTEND CHECK
     * Prevent booking if slot became booked
     * while user was filling the form.
     */
    if (bookedSlots.includes(selectedSlot)) {
      alert(
        'This slot has already been booked. Please choose another slot.'
      );

      setSelectedSlot('');
      return;
    }

    const result = await bookSlot({
      date,
      slot: selectedSlot,
      name: name.trim(),

      /*
       * Backend expects exactly 10 digits.
       */
      phone,
    });

    if (result.success) {
      setSuccess(true);

      /*
       * Refresh booked slots so the UI stays
       * synchronized with MongoDB.
       */
      try {
        const updatedSlots =
          await getBookedSlots(date);

        setBookedSlots(updatedSlots);
      } catch (err) {
        console.error(
          'Unable to refresh slots:',
          err
        );
      }
    }
  };

  /*
   * WHATSAPP CONFIRMATION
   */
  const handleWhatsApp = () => {
    if (!booking) return;

    window.open(
      createBookingWhatsAppUrl(booking),
      '_blank',
      'noopener,noreferrer'
    );
  };

  /*
   * RESET FORM FOR ANOTHER BOOKING
   */
  const handleNewBooking = () => {
    setSuccess(false);
    setSelectedSlot('');
    setName('');
    setPhone('');
  };

  return (
    <section
      className="booking"
      id="booking"
    >
      <div className="booking__container">

        {/* HEADER */}

        <div className="booking__heading">
          <div>
            <span className="booking__eyebrow">
              <i />
              BOOK YOUR GAME
            </span>

            <h2>
              PICK YOUR
              <span>PERFECT SLOT.</span>
            </h2>
          </div>

          <p>
            Select your date, choose an available
            time and reserve your game at Barwal
            Box Cricket.
          </p>
        </div>

        {/* MAIN */}

        <div className="booking__main">

          {/* LEFT INFO */}

          <aside className="booking__info">
            <div className="booking__info-top">
              <span>01</span>

              <div>
                <strong>BARWAL</strong>
                <small>BOX CRICKET</small>
              </div>
            </div>

            <div className="booking__info-content">
              <span>READY TO PLAY?</span>

              <h3>
                YOUR
                <strong>GAME AWAITS.</strong>
              </h3>

              <p>
                Choose your preferred slot and get
                your squad ready for the game.
              </p>
            </div>

            <div className="booking__info-list">
              <div>
                <Clock3 size={17} />

                <span>
                  <strong>OPEN 24 HOURS</strong>
                  Flexible playing hours
                </span>
              </div>

              <div>
                <MapPin size={17} />

                <span>
                  <strong>GONER ROAD</strong>
                  Jaipur, Rajasthan
                </span>
              </div>

              <div>
                <ShieldCheck size={17} />

                <span>
                  <strong>QUICK BOOKING</strong>
                  Simple slot selection
                </span>
              </div>
            </div>
          </aside>

          {/* BOOKING FORM */}

          <form
            className="booking__form"
            onSubmit={handleBooking}
          >

            {/* DATE */}

            <div className="booking__section">
              <div className="booking__section-head">
                <span>01</span>

                <div>
                  <strong>SELECT DATE</strong>
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

            {/* SLOTS */}

            <div className="booking__section">
              <div className="booking__section-head">
                <span>02</span>

                <div>
                  <strong>SELECT SLOT</strong>

                  <small>
                    {!date
                      ? 'Select a date first'
                      : slotsLoading
                        ? 'Checking availability...'
                        : `${slots.length - bookedSlots.length} slots available`}
                  </small>
                </div>
              </div>

              {slotError && (
                <div className="booking__error">
                  {slotError}
                </div>
              )}

              <div className="booking__slots">
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
                        setSelectedSlot(slot)
                      }
                    >
                      <span>{slot}</span>

                      {isBooked && (
                        <small>BOOKED</small>
                      )}

                      {!isBooked &&
                        selectedSlot === slot && (
                          <small>SELECTED</small>
                        )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DETAILS */}

            <div className="booking__section">
              <div className="booking__section-head">
                <span>03</span>

                <div>
                  <strong>YOUR DETAILS</strong>
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
                      setName(event.target.value)
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
                    onChange={handlePhoneChange}
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    required
                  />
                </label>

              </div>
            </div>

            {/* API ERROR */}

            {error && (
              <div className="booking__error">
                {error}
              </div>
            )}

            {/* SUBMIT / SUCCESS */}

            {!success ? (
              <button
                type="submit"
                className="booking__submit"
                disabled={
                  loading ||
                  slotsLoading ||
                  !date ||
                  !selectedSlot
                }
              >
                {loading ? (
                  <>
                    CONFIRMING...
                    <span className="booking__loader" />
                  </>
                ) : (
                  <>
                    CHECK & BOOK SLOT
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
                    BOOKING CREATED
                  </strong>

                  <span>
                    Booking ID:{' '}
                    {booking?.bookingId}
                  </span>

                  <small>
                    {booking?.date} ·{' '}
                    {booking?.slot}
                  </small>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle size={17} />
                  SEND ON WHATSAPP
                </button>

                <button
                  type="button"
                  className="booking__new"
                  onClick={handleNewBooking}
                >
                  BOOK ANOTHER SLOT
                </button>

              </div>
            )}

          </form>
        </div>

        {/* FOOTER */}

        <div className="booking__bottom">
          <div>
            <CheckCircle2 size={15} />
            <span>INSTANT SLOT CHECK</span>
          </div>

          <div>
            <ShieldCheck size={15} />
            <span>SAFE BOOKING</span>
          </div>

          <div>
            <MessageCircle size={15} />
            <span>WHATSAPP CONFIRMATION</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Booking;