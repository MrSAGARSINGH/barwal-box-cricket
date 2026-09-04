import { Check, Crown, Zap } from 'lucide-react';
import './Pricing.scss';

const plans = [
  {
    name: 'Standard',
    price: '₹699',
    duration: '/ hour',
    description: 'Perfect for casual games with friends.',
    icon: Zap,
    features: [
      'Premium turf access',
      'Power lighting',
      'Flexible booking',
      'Team / group play',
    ],
  },
  {
    name: 'Prime',
    price: '₹899',
    duration: '/ hour',
    description: 'Our recommended option for serious players.',
    icon: Crown,
    popular: true,
    features: [
      'Premium turf access',
      'Power lighting',
      'Priority slot selection',
      'Team / group play',
      'Premium game experience',
    ],
  },
  {
    name: 'Tournament',
    price: 'Custom',
    duration: '',
    description: 'For tournaments, events and larger groups.',
    icon: Crown,
    features: [
      'Tournament bookings',
      'Flexible game duration',
      'Large group support',
      'Event coordination',
    ],
  },
];

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="pricing__container">

        <div className="pricing__heading">
          <div>
            <span className="pricing__eyebrow">
              <i />
              SIMPLE PRICING
            </span>

            <h2>
              PICK YOUR
              <span>GAME PLAN.</span>
            </h2>
          </div>

          <p>
            Choose the option that fits your game.
            For tournaments and special events,
            contact our team for a custom plan.
          </p>
        </div>

        <div className="pricing__grid">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                className={`price-card ${
                  plan.popular ? 'price-card--popular' : ''
                }`}
                key={plan.name}
              >
                {plan.popular && (
                  <div className="price-card__popular">
                    MOST POPULAR
                  </div>
                )}

                <div className="price-card__top">
                  <div className="price-card__icon">
                    <Icon size={20} />
                  </div>

                  <span>0{plans.indexOf(plan) + 1}</span>
                </div>

                <h3>{plan.name}</h3>

                <p className="price-card__description">
                  {plan.description}
                </p>

                <div className="price-card__price">
                  <strong>{plan.price}</strong>
                  <span>{plan.duration}</span>
                </div>

                <div className="price-card__line" />

                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={15} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a href="#booking" className="price-card__button">
                  BOOK THIS PLAN
                </a>
              </article>
            );
          })}
        </div>

        <div className="pricing__note">
          <span>NEED A CUSTOM BOOKING?</span>
          <a href="#contact">TALK TO US →</a>
        </div>

      </div>
    </section>
  );
}

export default Pricing;