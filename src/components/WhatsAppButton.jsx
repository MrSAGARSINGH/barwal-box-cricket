import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import './WhatsAppButton.scss';

function WhatsAppButton() {
  const [showLabel, setShowLabel] = useState(false);

  const phoneNumber = '917820909090';

  const message = encodeURIComponent(
    'Hi Barwal Box Cricket, I want to book a box cricket slot.'
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div
      className={`whatsapp-button ${
        showLabel ? 'whatsapp-button--open' : ''
      }`}
    >
      {showLabel && (
        <div className="whatsapp-button__message">
          <button
            type="button"
            onClick={() => setShowLabel(false)}
            aria-label="Close WhatsApp message"
          >
            <X size={13} />
          </button>

          <strong>Need a slot?</strong>
          <span>Chat with Barwal Box Cricket</span>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-button__link"
        aria-label="Chat with Barwal Box Cricket on WhatsApp"
      >
        <MessageCircle size={25} />
      </a>

      <button
        type="button"
        className="whatsapp-button__toggle"
        onClick={() => setShowLabel(!showLabel)}
        aria-label="Toggle WhatsApp message"
      >
        {showLabel ? <X size={12} /> : <span />}
      </button>
    </div>
  );
}

export default WhatsAppButton;