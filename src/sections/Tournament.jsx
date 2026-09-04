import {
  ArrowRight,
  CalendarDays,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import './Tournament.scss';

const tournamentPoints = [
  {
    icon: Trophy,
    title: 'COMPETITIVE GAMES',
    text: 'Create your own tournament and bring your best squad.',
  },
  {
    icon: Users,
    title: 'LARGE GROUPS',
    text: 'A better setup for teams, clubs and group sessions.',
  },
  {
    icon: Zap,
    title: 'HIGH ENERGY',
    text: 'Keep the competition going with a premium playing environment.',
  },
];

function Tournament() {
  return (
    <section className="tournament" id="tournament">
      <div className="tournament__container">

        <div className="tournament__visual">
          <div className="tournament__glow" />

          <div className="tournament__topline">
            <span>BARWAL / 05</span>
            <span>EVENT SERIES</span>
          </div>

          <div className="tournament__badge">
            <Trophy size={21} />
            <span>TOURNAMENT</span>
          </div>

          <div className="tournament__title">
            <span>BRING</span>
            <strong>THE HEAT.</strong>
          </div>

          <div className="tournament__watermark">
            PLAY
          </div>

          <div className="tournament__visual-footer">
            <span>YOUR TEAM</span>
            <div />
            <strong>YOUR CHALLENGE</strong>
          </div>
        </div>

        <div className="tournament__content">
          <span className="tournament__eyebrow">
            <i />
            TOURNAMENTS & EVENTS
          </span>

          <h2>
            READY TO
            <span>COMPETE?</span>
          </h2>

          <p className="tournament__description">
            Turn your next game into an event. Barwal Box Cricket
            is built for team games, tournaments, celebrations
            and competitive sessions with your squad.
          </p>

          <div className="tournament__points">
            {tournamentPoints.map((point) => {
              const Icon = point.icon;

              return (
                <div className="tournament-point" key={point.title}>
                  <div className="tournament-point__icon">
                    <Icon size={19} />
                  </div>

                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="tournament__actions">
            <a href="#contact" className="tournament__primary">
              <CalendarDays size={17} />
              PLAN AN EVENT
              <ArrowRight size={17} />
            </a>

            <a href="#booking" className="tournament__secondary">
              BOOK A GAME
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Tournament;