import {
  Camera,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import './Facilities.scss';

const facilities = [
  {
    number: '01',
    icon: Trophy,
    title: 'Premium Turf',
    description: 'Quality playing surface built for competitive games.',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Power Lighting',
    description: 'Bright lighting for comfortable day and night play.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Safe & Secure',
    description: 'A clean and secure environment for your squad.',
  },
  {
    number: '04',
    icon: Users,
    title: 'Group Games',
    description: 'Perfect space for friends, teams and events.',
  },
  {
    number: '05',
    icon: Camera,
    title: 'Game Moments',
    description: 'Capture and share your best cricket moments.',
  },
  {
    number: '06',
    icon: Sparkles,
    title: 'Premium Experience',
    description: 'Everything you need to focus on the game.',
  },
];

function Facilities() {
  return (
    <section className="facilities" id="facilities">
      <div className="facilities__container">

        <div className="facilities__header">
          <div>
            <span className="facilities__eyebrow">
              <i />
              WHY BARWAL
            </span>

            <h2>
              BUILT FOR
              <span>YOUR GAME.</span>
            </h2>
          </div>

          <p>
            Everything is designed to make your
            playing experience smoother, better
            and more enjoyable.
          </p>
        </div>

        <div className="facilities__grid">
          {facilities.map((facility) => {
            const Icon = facility.icon;

            return (
              <article
                className="facility-card"
                key={facility.number}
              >
                <div className="facility-card__top">
                  <span>{facility.number}</span>

                  <div className="facility-card__icon">
                    <Icon size={22} />
                  </div>
                </div>

                <div className="facility-card__content">
                  <h3>{facility.title}</h3>

                  <p>{facility.description}</p>
                </div>

                <div className="facility-card__line" />
              </article>
            );
          })}
        </div>

        <div className="facilities__bottom">
          <span>READY FOR THE NEXT MATCH?</span>

          <a href="#booking">
            BOOK YOUR SLOT
          </a>
        </div>

      </div>
    </section>
  );
}

export default Facilities;