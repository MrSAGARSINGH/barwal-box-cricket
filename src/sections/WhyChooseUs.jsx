import {
  Clock3,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import './WhyChooseUs.scss';

const benefits = [
  {
    number: '01',
    icon: Clock3,
    title: 'PLAY 24/7',
    text: 'Choose a time that works for your squad and get on the pitch.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'PREMIUM TURF',
    text: 'A dedicated box cricket environment built around your game.',
  },
  {
    number: '03',
    icon: Zap,
    title: 'POWER LIGHTING',
    text: 'Keep the game going after sunset with proper playing visibility.',
  },
  {
    number: '04',
    icon: Users,
    title: 'MADE FOR TEAMS',
    text: 'Bring your friends, build your squad and make every game count.',
  },
  {
    number: '05',
    icon: ShieldCheck,
    title: 'SAFE SPACE',
    text: 'A comfortable and focused environment for players and teams.',
  },
];

function WhyChooseUs() {
  return (
    <section className="why" id="why-us">
      <div className="why__container">

        <div className="why__top">
          <div>
            <span className="why__eyebrow">
              <i />
              WHY BARWAL
            </span>

            <h2>
              BUILT FOR
              <span>YOUR GAME.</span>
            </h2>
          </div>

          <div className="why__intro">
            <span>THE BARWAL DIFFERENCE</span>
            <p>
              More than just a place to play. Everything is
              designed around a better, smoother and more
              enjoyable cricket experience.
            </p>
          </div>
        </div>

        <div className="why__main">

          <div className="why__statement">
            <div className="why__statement-number">
              <span>WHY</span>
              <strong>01</strong>
            </div>

            <div className="why__statement-copy">
              <span>YOUR TURF. YOUR RULES.</span>
              <h3>
                BRING THE
                <strong>WHOLE SQUAD.</strong>
              </h3>
              <p>
                Whether it is a quick evening game or a full team
                session, Barwal gives you the space to play your
                way without compromising the experience.
              </p>

              <a href="#booking">
                BOOK YOUR GAME
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="why__circle">
              <span>BARWAL</span>
              <strong>PLAY</strong>
              <small>BOX CRICKET</small>
            </div>
          </div>

          <div className="why__list">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article className="why-card" key={benefit.number}>
                  <span className="why-card__number">
                    {benefit.number}
                  </span>

                  <div className="why-card__icon">
                    <Icon size={21} />
                  </div>

                  <div className="why-card__content">
                    <h3>{benefit.title}</h3>
                    <p>{benefit.text}</p>
                  </div>

                  <ArrowUpRight
                    className="why-card__arrow"
                    size={19}
                  />
                </article>
              );
            })}
          </div>

        </div>

        <div className="why__bottom">
          <span>BARWAL BOX CRICKET</span>
          <div />
          <strong>GAME. ENERGY. COMMUNITY.</strong>
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;