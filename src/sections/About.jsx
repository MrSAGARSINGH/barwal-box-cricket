import { ArrowUpRight, Clock3, MapPin, Trophy } from 'lucide-react';
import './About.scss';

function About() {
  return (
    <section className="about" id="about">
      <div className="about__container">

        <div className="about__top">
          <div className="about__label">
            <span />
            ABOUT BARWAL
          </div>

          <p className="about__intro">
            More than a turf.
            <strong>It's your game space.</strong>
          </p>
        </div>

        <div className="about__grid">

          <div className="about__visual">
            <div className="about__visual-number">01</div>

            <div className="about__visual-content">
              <span>BUILT FOR</span>
              <strong>THE GAME.</strong>
            </div>

            <div className="about__visual-mark">
              B
            </div>
          </div>

          <div className="about__content">
            <span className="about__kicker">
              PLAY. COMPETE. REPEAT.
            </span>

            <h2>
              WHERE EVERY
              <span>DELIVERY</span>
              MATTERS.
            </h2>

            <p>
              Barwal Box Cricket is built for players who want
              more from every game. Bring your squad, book your
              slot and step onto a dedicated box-cricket
              environment made for competitive play.
            </p>

            <p>
              Whether it's a quick match with friends, a
              weekend game or a group booking, Barwal gives
              your team the space to simply focus on the game.
            </p>

            <a href="#booking" className="about__link">
              Book Your Game
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>

        <div className="about__stats">

          <div className="about__stat">
            <div className="about__stat-icon">
              <Clock3 size={22} />
            </div>

            <div>
              <strong>24/7</strong>
              <span>OPEN AVAILABILITY</span>
            </div>
          </div>

          <div className="about__stat">
            <div className="about__stat-icon">
              <MapPin size={22} />
            </div>

            <div>
              <strong>JAIPUR</strong>
              <span>GONER ROAD</span>
            </div>
          </div>

          <div className="about__stat">
            <div className="about__stat-icon">
              <Trophy size={22} />
            </div>

            <div>
              <strong>BOX CRICKET</strong>
              <span>MADE FOR TEAMS</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default About;