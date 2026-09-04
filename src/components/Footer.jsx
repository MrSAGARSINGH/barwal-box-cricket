import {
  ArrowUpRight,
  Camera,
  MapPin,
  Phone,
  Trophy,
} from 'lucide-react';

import './Footer.scss';

const footerLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Facilities', href: '#facilities' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">

        {/* CTA */}
        <div className="footer__cta">
          <div>
            <span>YOUR NEXT GAME STARTS NOW</span>

            <h2>
              SEE YOU
              <strong>ON THE PITCH.</strong>
            </h2>
          </div>

          <a href="#booking">
            BOOK YOUR SLOT
            <ArrowUpRight size={20} />
          </a>
        </div>

        {/* MAIN FOOTER */}
        <div className="footer__main">

          {/* BRAND */}
          <div className="footer__brand">
            <a href="#home" className="footer__logo">
              <span>B</span>

              <div>
                <strong>BARWAL</strong>
                <small>BOX CRICKET</small>
              </div>
            </a>

            <p>
              Premium box cricket experience in Jaipur.
              Bring your squad, step onto the turf and
              make your game count.
            </p>

            <div className="footer__socials">
              <a
                href="#contact"
                aria-label="Barwal social media"
              >
                <Camera size={17} />
              </a>

              <a
                href="tel:+917820909090"
                aria-label="Call Barwal Box Cricket"
              >
                <Phone size={17} />
              </a>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="footer__column">
            <span className="footer__label">
              EXPLORE
            </span>

            <nav>
              {footerLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.name}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* LOCATION */}
          <div className="footer__column footer__location">
            <span className="footer__label">
              LOCATION
            </span>

            <div className="footer__info">
              <MapPin size={17} />

              <p>
                Near Rajasthan Aawasan Mandal,
                Indra Gandhi Nagar,
                Goner Road, Jaipur
              </p>
            </div>

            <div className="footer__info">
              <Trophy size={17} />

              <p>
                Box Cricket

                <strong>
                  Open 24 Hours
                </strong>
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer__bottom">

          <span>
            © {new Date().getFullYear()} BARWAL BOX CRICKET
          </span>

          <div />

          <span>
            JAIPUR · RAJASTHAN
          </span>

          <a
            href="#home"
            aria-label="Back to top"
          >
            TOP
            <ArrowUpRight size={14} />
          </a>

        </div>

      </div>
    </footer>
  );
}

export default Footer;