import {
  ArrowUpRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import './Contact.scss';

const contactDetails = [
  {
    icon: MapPin,
    label: 'LOCATION',
    title: 'Goner Road, Jaipur',
    text: 'Near Rajasthan Aawasan Mandal, Indra Gandhi Nagar, Jaipur',
  },
  {
    icon: Phone,
    label: 'CALL US',
    title: '+91 78209 09090',
    text: 'Call for bookings and enquiries',
  },
  {
    icon: Clock3,
    label: 'OPENING HOURS',
    title: 'Open 24 Hours',
    text: 'Play when it works for your squad',
  },
];

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__container">

        <div className="contact__heading">
          <span className="contact__eyebrow">
            <i />
            FIND BARWAL
          </span>

          <h2>
            LET'S
            <span>PLAY.</span>
          </h2>

          <p>
            Got a question, want to plan a game or arrange
            a group booking? Get in touch with Barwal Box Cricket.
          </p>
        </div>

        <div className="contact__main">

          <div className="contact__details">
            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <article className="contact-card" key={item.label}>
                  <div className="contact-card__icon">
                    <Icon size={20} />
                  </div>

                  <div className="contact-card__content">
                    <span>{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>

                  <ArrowUpRight className="contact-card__arrow" size={18} />
                </article>
              );
            })}
          </div>

          <div className="contact__map">
            <div className="contact__map-overlay" />

            <div className="contact__map-grid" />

            <div className="contact__pin">
              <span>
                <MapPin size={21} />
              </span>

              <div>
                <strong>BARWAL BOX CRICKET</strong>
                <small>GONER ROAD · JAIPUR</small>
              </div>
            </div>

            <div className="contact__map-label">
              <span>01</span>
              <strong>YOUR GAME<br />IS HERE.</strong>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Barwal+Box+Cricket+Jaipur"
              target="_blank"
              rel="noreferrer"
              className="contact__map-button"
            >
              OPEN IN MAPS
              <ArrowUpRight size={17} />
            </a>
          </div>

        </div>

        <div className="contact__actions">
          <a
            href="tel:+917820909090"
            className="contact__call"
          >
            <Phone size={18} />
            <div>
              <span>READY TO BOOK?</span>
              <strong>CALL +91 78209 09090</strong>
            </div>
            <ArrowUpRight size={18} />
          </a>

          <a
            href="https://wa.me/917820909090"
            target="_blank"
            rel="noreferrer"
            className="contact__whatsapp"
          >
            <MessageCircle size={19} />
            WHATSAPP US
          </a>
        </div>

        <div className="contact__footer">
          <span>BARWAL BOX CRICKET</span>
          <div />
          <strong>JAIPUR · RAJASTHAN</strong>
        </div>

      </div>
    </section>
  );
}

export default Contact;