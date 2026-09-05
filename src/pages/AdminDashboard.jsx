import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  cancelBooking as cancelBookingApi,
  getAllBookings,
} from '../services/bookingService';

import './AdminDashboard.scss';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0]
    );

  const [selectedVenue, setSelectedVenue] =
    useState('all');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [cancelLoading, setCancelLoading] =
    useState('');

  const [error, setError] =
    useState('');

  /* =========================
     FETCH ALL BOOKINGS
  ========================= */

  const fetchBookings = useCallback(
    async (showLoader = true) => {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError('');

      try {
        const data =
          await getAllBookings();

        setBookings(data);
      } catch (err) {
        console.error(
          'Admin bookings error:',
          err
        );

        setError(
          err.message ||
            'Unable to load bookings.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const today = new Date()
    .toISOString()
    .split('T')[0];

  /* =========================
     ACTIVE BOOKINGS
  ========================= */

  const activeBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === 'confirmed'
      ),
    [bookings]
  );

  /* =========================
     TODAY'S BOOKINGS
  ========================= */

  const todayBookings = useMemo(
    () =>
      activeBookings.filter(
        (booking) =>
          booking.date === today
      ),
    [activeBookings, today]
  );

  /* =========================
     SELECTED DATE BOOKINGS
  ========================= */

  const selectedDateBookings = useMemo(
    () =>
      activeBookings
        .filter(
          (booking) =>
            booking.date === selectedDate
        )
        .filter(
          (booking) =>
            selectedVenue === 'all' ||
            booking.venue === selectedVenue
        )
        .sort((a, b) =>
          a.slot.localeCompare(b.slot)
        ),
    [
      activeBookings,
      selectedDate,
      selectedVenue,
    ]
  );

  /* =========================
     CANCELLED BOOKINGS
  ========================= */

  const cancelledBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === 'cancelled'
      ),
    [bookings]
  );

  /* =========================
     CANCEL BOOKING
  ========================= */

  const handleCancelBooking = async (
    booking
  ) => {
    const confirmed =
      window.confirm(
        `Cancel booking ${booking.bookingId} for ${booking.name}?`
      );

    if (!confirmed) {
      return;
    }

    setCancelLoading(
      booking.bookingId
    );

    setError('');

    try {
      const updatedBooking =
        await cancelBookingApi(
          booking.bookingId
        );

      setBookings(
        (currentBookings) =>
          currentBookings.map(
            (item) =>
              item.bookingId ===
              updatedBooking.bookingId
                ? updatedBooking
                : item
          )
      );
    } catch (err) {
      console.error(
        'Cancel booking error:',
        err
      );

      setError(
        err.message ||
          'Unable to cancel booking.'
      );
    } finally {
      setCancelLoading('');
    }
  };

  /* =========================
     WHATSAPP CUSTOMER
  ========================= */

  const openWhatsApp = (booking) => {
    const phone =
      booking.phone.replace(
        /\D/g,
        ''
      );

    const whatsappPhone =
      phone.length === 10
        ? `91${phone}`
        : phone;

    const venueName =
      booking.venue === 'ground'
        ? 'Cricket Ground'
        : 'Box Cricket';

    const message = `
Hi ${booking.name},

Your Barwal booking has been received.

Booking ID: ${booking.bookingId}
Venue: ${venueName}
Date: ${booking.date}
Slot: ${booking.slot}

Thank you for choosing Barwal Box Cricket.
    `.trim();

    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        message
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /* =========================
     CALL CUSTOMER
  ========================= */

  const callCustomer = (phone) => {
    window.location.href =
      `tel:${phone}`;
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    sessionStorage.removeItem(
      'barwal_admin_token'
    );

    sessionStorage.removeItem(
      'barwal_admin_data'
    );

    window.location.href =
      '/admin/login';
  };

  /* =========================
     VENUE LABEL
  ========================= */

  const getVenueLabel = (venue) => {
    return venue === 'ground'
      ? 'CRICKET GROUND'
      : 'BOX CRICKET';
  };

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard__container">

        {/* =========================
            HEADER
        ========================= */}

        <header className="admin-dashboard__header">
          <div className="admin-dashboard__brand">

            <div className="admin-dashboard__logo">
              B
            </div>

            <div>
              <strong>
                BARWAL
              </strong>

              <span>
                BOX CRICKET · ADMIN
              </span>
            </div>
          </div>

          <div className="admin-dashboard__header-right">

            <div className="admin-dashboard__status">
              <i />
              SYSTEM ACTIVE
            </div>

            <button
              type="button"
              className="admin-dashboard__refresh"
              onClick={() =>
                fetchBookings(false)
              }
              disabled={refreshing}
              title="Refresh bookings"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? 'is-spinning'
                    : ''
                }
              />
            </button>

            <a
              href="/"
              className="admin-dashboard__website"
            >
              VIEW WEBSITE
            </a>

            <button
              type="button"
              className="admin-dashboard__logout"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              EXIT
            </button>
          </div>
        </header>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="admin-dashboard__error">
            <XCircle size={17} />

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                fetchBookings(false)
              }
            >
              RETRY
            </button>
          </div>
        )}

        {/* =========================
            WELCOME
        ========================= */}

        <section className="admin-dashboard__welcome">

          <div>
            <span>
              <ShieldCheck size={15} />
              ADMIN CONTROL CENTER
            </span>

            <h1>
              MANAGE YOUR
              <strong>GAME.</strong>
            </h1>

            <p>
              Monitor bookings, manage slots and
              keep your ground running smoothly.
            </p>
          </div>

          <div className="admin-dashboard__date">
            <CalendarDays size={18} />

            <div>
              <small>
                TODAY
              </small>

              <strong>
                {new Date().toLocaleDateString(
                  'en-IN',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }
                )}
              </strong>
            </div>
          </div>

        </section>

        {/* =========================
            STATS
        ========================= */}

        <section className="admin-dashboard__stats">

          <article>
            <div className="admin-dashboard__stat-icon">
              <CalendarDays size={19} />
            </div>

            <span>
              TODAY'S BOOKINGS
            </span>

            <strong>
              {todayBookings.length}
            </strong>

            <small>
              Confirmed bookings today
            </small>
          </article>

          <article>
            <div className="admin-dashboard__stat-icon">
              <Users size={19} />
            </div>

            <span>
              TOTAL BOOKINGS
            </span>

            <strong>
              {activeBookings.length}
            </strong>

            <small>
              Active bookings
            </small>
          </article>

          <article>
            <div className="admin-dashboard__stat-icon">
              <CheckCircle2 size={19} />
            </div>

            <span>
              CONFIRMED
            </span>

            <strong>
              {activeBookings.length}
            </strong>

            <small>
              Currently active
            </small>
          </article>

          <article>
            <div className="admin-dashboard__stat-icon">
              <XCircle size={19} />
            </div>

            <span>
              CANCELLED
            </span>

            <strong>
              {cancelledBookings.length}
            </strong>

            <small>
              Cancelled bookings
            </small>
          </article>

        </section>

        {/* =========================
            CONTENT
        ========================= */}

        <section className="admin-dashboard__content">

          {/* =========================
              BOOKINGS
          ========================= */}

          <div className="admin-dashboard__bookings">

            <div className="admin-dashboard__section-head">

              <div>
                <span>
                  BOOKING MANAGEMENT
                </span>

                <h2>
                  SELECTED
                  <strong> DAY.</strong>
                </h2>
              </div>

              <div className="admin-dashboard__filters">

                {/* DATE */}

                <label>
                  <CalendarDays size={16} />

                  <input
                    type="date"
                    value={selectedDate}
                    min={today}
                    onChange={(event) =>
                      setSelectedDate(
                        event.target.value
                      )
                    }
                  />
                </label>

                {/* VENUE */}

                <label>
                  <MapPin size={16} />

                  <select
                    value={selectedVenue}
                    onChange={(event) =>
                      setSelectedVenue(
                        event.target.value
                      )
                    }
                  >
                    <option value="all">
                      ALL VENUES
                    </option>

                    <option value="box-cricket">
                      BOX CRICKET
                    </option>

                    <option value="ground">
                      CRICKET GROUND
                    </option>
                  </select>
                </label>

              </div>

            </div>

            {/* =========================
                LOADING
            ========================= */}

            {loading ? (
              <div className="admin-dashboard__empty">

                <RefreshCw
                  size={28}
                  className="is-spinning"
                />

                <strong>
                  LOADING BOOKINGS
                </strong>

                <span>
                  Fetching latest data from MongoDB...
                </span>

              </div>
            ) : selectedDateBookings.length ===
              0 ? (
              <div className="admin-dashboard__empty">

                <Clock3 size={28} />

                <strong>
                  NO BOOKINGS
                </strong>

                <span>
                  No active bookings for this
                  date and venue.
                </span>

              </div>
            ) : (
              <div className="admin-dashboard__booking-list">

                {selectedDateBookings.map(
                  (booking) => (
                    <article
                      className="admin-dashboard__booking"
                      key={booking.bookingId}
                    >

                      {/* TIME */}

                      <div className="admin-dashboard__booking-time">
                        <Clock3 size={16} />

                        <strong>
                          {booking.slot}
                        </strong>
                      </div>

                      {/* CUSTOMER */}

                      <div className="admin-dashboard__booking-info">

                        <strong>
                          {booking.name}
                        </strong>

                        <span>
                          {booking.bookingId}
                        </span>

                        <small
                          className={`admin-dashboard__venue ${
                            booking.venue === 'ground'
                              ? 'admin-dashboard__venue--ground'
                              : ''
                          }`}
                        >
                          {getVenueLabel(
                            booking.venue
                          )}
                        </small>

                      </div>

                      {/* PHONE */}

                      <div className="admin-dashboard__booking-phone">
                        <Phone size={14} />

                        {booking.phone}
                      </div>

                      {/* ACTIONS */}

                      <div className="admin-dashboard__booking-actions">

                        <button
                          type="button"
                          onClick={() =>
                            callCustomer(
                              booking.phone
                            )
                          }
                          title="Call customer"
                        >
                          <Phone size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openWhatsApp(
                              booking
                            )
                          }
                          title="WhatsApp customer"
                        >
                          <MessageCircle
                            size={15}
                          />
                        </button>

                        <button
                          type="button"
                          className="danger"
                          disabled={
                            cancelLoading ===
                            booking.bookingId
                          }
                          onClick={() =>
                            handleCancelBooking(
                              booking
                            )
                          }
                          title="Cancel booking"
                        >
                          {cancelLoading ===
                          booking.bookingId ? (
                            <RefreshCw
                              size={15}
                              className="is-spinning"
                            />
                          ) : (
                            <Trash2
                              size={15}
                            />
                          )}
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}

          </div>

          {/* =========================
              SIDE PANEL
          ========================= */}

          <aside className="admin-dashboard__side">

            <div className="admin-dashboard__side-card">

              <div className="admin-dashboard__side-icon">
                <MapPin size={19} />
              </div>

              <span>
                VENUES
              </span>

              <h3>
                BARWAL
                <strong>
                  BOX CRICKET & GROUND
                </strong>
              </h3>

              <p>
                Goner Road, Jaipur, Rajasthan
              </p>

              <div className="admin-dashboard__side-status">
                <i />
                OPEN 24 HOURS
              </div>

            </div>

            <div className="admin-dashboard__side-card admin-dashboard__quick">

              <span>
                QUICK OVERVIEW
              </span>

              <div>
                <small>
                  Today's activity
                </small>

                <strong>
                  {todayBookings.length}{' '}
                  bookings
                </strong>
              </div>

              <div>
                <small>
                  Box Cricket
                </small>

                <strong>
                  {
                    todayBookings.filter(
                      (booking) =>
                        booking.venue ===
                        'box-cricket'
                    ).length
                  }
                </strong>
              </div>

              <div>
                <small>
                  Cricket Ground
                </small>

                <strong>
                  {
                    todayBookings.filter(
                      (booking) =>
                        booking.venue ===
                        'ground'
                    ).length
                  }
                </strong>
              </div>

              <div>
                <small>
                  Cancelled
                </small>

                <strong>
                  {cancelledBookings.length}
                </strong>
              </div>

            </div>

          </aside>

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="admin-dashboard__footer">

          <span>
            BARWAL BOX CRICKET · ADMIN PANEL
          </span>

          <span>
            <i />
            MONGODB BOOKING SYSTEM ACTIVE
          </span>

        </footer>

      </div>
    </main>
  );
}

export default AdminDashboard;