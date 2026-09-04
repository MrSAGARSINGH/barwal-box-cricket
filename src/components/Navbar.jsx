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

        <a href="#home" className="navbar__brand" onClick={closeMenu}>
          <span className="navbar__mark">B</span>

          <span className="navbar__name">
            <strong>BARWAL</strong>
            <small>BOX CRICKET</small>
          </span>
        </a>

        <nav className="navbar__links">
          {links.map((link) => (
            <a href={link.href} key={link.name}>
              {link.name}
            </a>
          ))}
        </nav>

        <a href="#booking" className="navbar__cta">
          <CalendarDays size={17} />
          Book Now
        </a>

        <button
          type="button"
          className="navbar__menu"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      <div className="navbar__mobile">
        <nav>
          {links.map((link) => (
            <a
              href={link.href}
              key={link.name}
              onClick={closeMenu}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <a
          href="#booking"
          className="navbar__mobile-cta"
          onClick={closeMenu}
        >
          <CalendarDays size={18} />
          Book Your Slot
        </a>
      </div>
    </header>
  );
}

export default Navbar;