import { ArrowLeft, Home } from 'lucide-react';

function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__content">
        <span>404 · PAGE NOT FOUND</span>

        <h1>
          LOST
          <strong>ON THE PITCH?</strong>
        </h1>

        <p>
          The page you're looking for doesn't exist.
          Let's get you back to Barwal Box Cricket.
        </p>

        <div className="not-found__actions">
          <a href="/">
            <Home size={17} />
            BACK HOME
          </a>

          <button
            type="button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={17} />
            GO BACK
          </button>
        </div>
      </div>
    </main>
  );
}

export default NotFound;