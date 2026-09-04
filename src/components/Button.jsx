import { ArrowRight } from 'lucide-react';
import './Button.scss';

function Button({
  children,
  href,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  icon = true,
  disabled = false,
  onClick,
  className = '',
}) {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span className="button__text">{children}</span>

      {icon && (
        <span className="button__icon">
          <ArrowRight size={17} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-disabled={disabled}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default Button;