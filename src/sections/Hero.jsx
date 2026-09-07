import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Play,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import './Hero.scss';

const heroImages = [
  {
    src: '/images/barwal-1.webp',
    alt: 'Barwal Box Cricket ground',
    position: 'center center',
  },
  {
    src: '/images/barwal-2.webp',
    alt: 'Barwal Box Cricket turf',
    position: 'center center',
  },
  {
    src: '/images/barwal-3.webp',
    alt: 'Barwal Box Cricket playing area',
    position: 'center center',
  },
  {
    src: '/images/barwal-4.webp',
    alt: 'Barwal Box Cricket night view',
    position: 'center center',
  },
  {
    src: '/images/barwal-5.webp',
    alt: 'Barwal Box Cricket',
    position: 'center center',
  },
  {
    src: '/images/barwal-6.webp',
    alt: 'Barwal Box Cricket ground',
    position: 'center center',
  },
  {
    src: '/images/barwal-7.webp',
    alt: 'Barwal Box Cricket playing area',
    position: 'center center',
  },
  {
    src: '/images/barwal-8.webp',
    alt: 'Barwal Box Cricket experience',
    position: 'center center',
  },
];

function Hero() {
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const changeImage = (index) => {
    setActiveImage(index);
  };

  return (
    <section className="hero" id="home">
      <div className="hero__glow hero__glow--one" />
      <div className="hero__glow hero__glow--two" />

      <div className="hero__container">

        {/* LEFT CONTENT */}
        <div className="hero__content">

          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            PREMIUM BOX CRICKET • JAIPUR
          </div>

          <h1 className="hero__title">
            PLAY HARD.
            <span>PLAY SMART.</span>
            <strong>PLAY BARWAL.</strong>
          </h1>

          <p className="hero__description">
            Your game. Your squad. Your turf.
            Experience premium box cricket with a
            professional playing environment in Jaipur.
          </p>

          <div className="hero__actions">

            <a href="#booking" className="hero__primary">
              <CalendarDays size={18} />
              <span>Book Your Slot</span>
              <ArrowRight size={17} />
            </a>

            <a href="#gallery" className="hero__secondary">
              <Play size={16} />
              <span>Explore Ground</span>
            </a>

          </div>

          <div className="hero__meta">

            <div className="hero__meta-item">
              <MapPin size={18} />

              <div>
                <span>LOCATION</span>
                <strong>Goner Road, Jaipur</strong>
              </div>
            </div>

            <div className="hero__divider" />

            <div className="hero__meta-item">
              <span className="hero__open-dot" />

              <div>
                <span>AVAILABLE</span>
                <strong>Open 24 Hours</strong>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT CINEMATIC VISUAL */}
        <div
          className="hero__visual"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          <div className="hero__visual-glow" />

          <div className="hero__image-card">

            {/* CINEMATIC PHOTO SEQUENCE */}
            <div className="hero__slides">

              {heroImages.map((image, index) => (
                <div
                  key={image.src}
                  className={`
                    hero__slide
                    hero__slide--motion-${index + 1}
                    ${index === activeImage ? 'hero__slide--active' : ''}
                    ${
                      index ===
                      (activeImage + 1) % heroImages.length
                        ? 'hero__slide--next'
                        : ''
                    }
                  `}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{
                      objectPosition: image.position,
                    }}
                  />
                </div>
              ))}

            </div>

            {/* CINEMATIC OVERLAYS */}
            <div className="hero__image-overlay" />
            <div className="hero__image-vignette" />
            <div className="hero__image-light" />

            {/* BRAND */}
            <div className="hero__image-content">
              <span>BARWAL</span>
              <strong>BOX CRICKET</strong>
            </div>

            {/* COUNTER */}
            <div className="hero__counter">
              <strong key={activeImage}>
                {String(activeImage + 1).padStart(2, '0')}
              </strong>

              <span>
                / {String(heroImages.length).padStart(2, '0')}
              </span>
            </div>

            {/* PROGRESS */}
            <div className="hero__progress">
              <span
                key={activeImage}
                className="hero__progress-bar"
              />
            </div>

          </div>

          {/* TOP BADGE */}
          <div className="hero__badge">
            <span>01</span>
            PREMIUM
            <small>PLAYING EXPERIENCE</small>
          </div>

          {/* DOT NAVIGATION */}
          <div className="hero__dots">

            {heroImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-current={
                  index === activeImage ? 'true' : undefined
                }
                className={
                  index === activeImage
                    ? 'hero__dot hero__dot--active'
                    : 'hero__dot'
                }
                onClick={() => changeImage(index)}
              />
            ))}

          </div>

          {/* BOTTOM INFO */}
          <div className="hero__floating-card">
            <strong>24/7</strong>
            <span>PLAY WHEN YOU WANT</span>
          </div>

        </div>
      </div>

      {/* BOTTOM FEATURES */}
      <div className="hero__features">

        <div className="hero__feature">
          <span>01</span>
          <div>
            <strong>PREMIUM TURF</strong>
            <small>Quality playing surface</small>
          </div>
        </div>

        <div className="hero__feature">
          <span>02</span>
          <div>
            <strong>SAFE & SECURE</strong>
            <small>Comfortable playing environment</small>
          </div>
        </div>

        <div className="hero__feature">
          <span>03</span>
          <div>
            <strong>POWER LIGHTS</strong>
            <small>Play even after sunset</small>
          </div>
        </div>

        <div className="hero__feature">
          <span>04</span>
          <div>
            <strong>GROUP BOOKINGS</strong>
            <small>Perfect for your squad</small>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;