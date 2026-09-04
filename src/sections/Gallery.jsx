import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './Gallery.scss';

const galleryImages = [
  {
    src: '/images/barwal-1.webp',
    title: 'The Main Arena',
    category: 'GROUND',
  },
  {
    src: '/images/barwal-2.webp',
    title: 'Game On',
    category: 'MATCH',
  },
  {
    src: '/images/barwal-3.webp',
    title: 'Premium Turf',
    category: 'TURF',
  },
  {
    src: '/images/barwal-4.webp',
    title: 'Night Games',
    category: 'NIGHT',
  },
  {
    src: '/images/barwal-5.webp',
    title: 'Your Squad',
    category: 'EXPERIENCE',
  },
];

function Gallery() {
  const [activeImage, setActiveImage] = useState(null);

  const openImage = (index) => {
    setActiveImage(index);
  };

  const closeImage = () => {
    setActiveImage(null);
  };

  const showNext = () => {
    setActiveImage((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1
    );
  };

  const showPrevious = () => {
    setActiveImage((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1
    );
  };

  useEffect(() => {
    if (activeImage === null) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeImage();
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrevious();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeImage]);

  return (
    <>
      <section className="gallery" id="gallery">
        <div className="gallery__container">

          <div className="gallery__heading">
            <div>
              <span className="gallery__eyebrow">
                <i />
                INSIDE BARWAL
              </span>

              <h2>
                SEE THE
                <span>GAME SPACE.</span>
              </h2>
            </div>

            <div className="gallery__intro">
              <p>
                Get a feel for the ground, the turf and the
                atmosphere before you step onto the pitch.
              </p>

              <span className="gallery__count">
                05 <small>CAPTURES</small>
              </span>
            </div>
          </div>

          <div className="gallery__grid">
            {galleryImages.map((image, index) => (
              <button
                type="button"
                className={`gallery__item gallery__item--${index + 1}`}
                key={image.src}
                onClick={() => openImage(index)}
                aria-label={`View ${image.title}`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                <div className="gallery__overlay" />

                <div className="gallery__number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="gallery__content">
                  <span>{image.category}</span>
                  <strong>{image.title}</strong>
                </div>

                <div className="gallery__arrow">
                  <ArrowUpRight size={20} />
                </div>
              </button>
            ))}
          </div>

          <div className="gallery__bottom">
            <div className="gallery__line" />

            <p>
              YOUR NEXT GAME
              <strong>STARTS HERE.</strong>
            </p>

            <a href="#booking">
              BOOK YOUR SLOT
              <ArrowUpRight size={17} />
            </a>
          </div>

        </div>
      </section>

      {activeImage !== null && (
        <div
          className="gallery-modal"
          role="dialog"
          aria-modal="true"
          onClick={closeImage}
        >
          <button
            type="button"
            className="gallery-modal__close"
            onClick={closeImage}
            aria-label="Close gallery"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            className="gallery-modal__prev"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={25} />
          </button>

          <div
            className="gallery-modal__content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={galleryImages[activeImage].src}
              alt={galleryImages[activeImage].title}
            />

            <div className="gallery-modal__caption">
              <span>
                {String(activeImage + 1).padStart(2, '0')} / 05
              </span>
              <strong>{galleryImages[activeImage].title}</strong>
            </div>
          </div>

          <button
            type="button"
            className="gallery-modal__next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={25} />
          </button>
        </div>
      )}
    </>
  );
}

export default Gallery;