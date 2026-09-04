import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { useState } from 'react';
import './Testimonials.scss';

const testimonials = [
  {
    name: 'YOUR PLAYER REVIEW',
    role: 'CUSTOMER FEEDBACK',
    text: 'Loved the overall playing experience. The ground setup and atmosphere make it a great place for a game with the squad.',
  },
  {
    name: 'YOUR TEAM REVIEW',
    role: 'GROUP BOOKING',
    text: 'A dedicated space where the whole team can come together, play and enjoy the game without distractions.',
  },
  {
    name: 'YOUR SQUAD REVIEW',
    role: 'PLAYER FEEDBACK',
    text: 'The experience feels focused on the game. Perfect for an evening session with friends and teammates.',
  },
];

function Testimonials() {
  const [active, setActive] = useState(0);

  const previous = () => {
    setActive((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  const next = () => {
    setActive((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  const testimonial = testimonials[active];

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__container">

        <div className="testimonials__heading">
          <div>
            <span className="testimonials__eyebrow">
              <i />
              PLAYER VOICES
            </span>

            <h2>
              HEARD FROM
              <span>THE GAME.</span>
            </h2>
          </div>

          <p>
            Every game creates a story. Here is where the
            Barwal experience meets the people who play it.
          </p>
        </div>

        <div className="testimonials__main">

          <div className="testimonials__visual">
            <Quote size={32} />

            <span className="testimonials__visual-word">
              GAME
            </span>

            <div className="testimonials__visual-bottom">
              <strong>BARWAL</strong>
              <small>BOX CRICKET</small>
            </div>
          </div>

          <div className="testimonials__review">

            <div className="testimonials__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={15} fill="currentColor" />
              ))}
            </div>

            <blockquote>
              “{testimonial.text}”
            </blockquote>

            <div className="testimonials__author">
              <div className="testimonials__avatar">
                {String(active + 1).padStart(2, '0')}
              </div>

              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>

            <div className="testimonials__controls">
              <span>
                {String(active + 1).padStart(2, '0')}
                <small> / {String(testimonials.length).padStart(2, '0')}</small>
              </span>

              <div>
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next testimonial"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>

        </div>

        <div className="testimonials__footer">
          <span>REAL GAMES. REAL ENERGY.</span>
          <div />
          <strong>YOUR REVIEW COULD BE NEXT.</strong>
        </div>

      </div>
    </section>
  );
}

export default Testimonials;