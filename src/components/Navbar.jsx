import { CalendarDays, Menu, X } from 'lucide-react';
import { useState } from 'react';

import './Navbar.scss';

const links = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Facilities', href: '#facilities' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`navbar ${open ? 'navbar--open' : ''}`}>
      <div className="navbar__inner">

        {/* =========================
            BRAND
        ========================= */}
        <a
          href="#home"
          className="navbar__brand"
          onClick={closeMenu}
          aria-label="Barwal Box Cricket and Ground"
        >
          <span className="navbar__mark">
            B
          </span>

          <span className="navbar__name">
            <strong>BARWAL</strong>
            <small>BOX CRICKET &amp; GROUND</small>
          </span>
        </a>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}
        <nav
          className="navbar__links"
          aria-label="Main navigation"
        >
          {links.map((link, index) => (
            <a
              href={link.href}
              key={link.name}
              style={{
                '--nav-index': index,
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* =========================
            DESKTOP CTA
        ========================= */}
        <a
          href="#booking"
          className="navbar__cta"
        >
          <CalendarDays size={17} />
          <span>Book Now</span>
        </a>

        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}
        <button
          type="button"
          className="navbar__menu"
          onClick={() => setOpen((current) => !current)}
          aria-label={
            open
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={open}
        >
          <span className="navbar__menu-icon">
            {open ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </span>
        </button>
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}
      <div className="navbar__mobile">
        <nav aria-label="Mobile navigation">
          {links.map((link, index) => (
            <a
              href={link.href}
              key={link.name}
              onClick={closeMenu}
              style={{
                '--mobile-index': index,
              }}
            >
              <span className="navbar__mobile-number">
                0{index + 1}
              </span>

              <span>{link.name}</span>
            </a>
          ))}
        </nav>

        <a
          href="#booking"
          className="navbar__mobile-cta"
          onClick={closeMenu}
        >
          <CalendarDays size={18} />
          <span>Book Your Slot</span>
        </a>
      </div>
    </header>
  );
}

export default Navbar;