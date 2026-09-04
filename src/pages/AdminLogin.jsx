import {
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  isAdminAuthenticated,
  loginAdmin,
} from '../services/authService';

import './AdminLogin.scss';

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard', {
        replace: true,
      });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    if (!email.trim()) {
      setError('Please enter your admin email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    const result = await loginAdmin(
      email,
      password
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate('/admin/dashboard', {
      replace: true,
    });
  };

  return (
    <main className="admin-login">
      <div className="admin-login__glow" />

      <div className="admin-login__card">

        <div className="admin-login__brand">
          <span>B</span>

          <div>
            <strong>BARWAL</strong>
            <small>BOX CRICKET</small>
          </div>
        </div>

        <div className="admin-login__heading">

          <div className="admin-login__icon">
            <LockKeyhole size={21} />
          </div>

          <span>ADMIN ACCESS</span>

          <h1>
            MANAGE YOUR
            <strong>GROUND.</strong>
          </h1>

          <p>
            Secure access to bookings, slots and
            ground management.
          </p>

        </div>

        <form
          className="admin-login__form"
          onSubmit={handleSubmit}
        >

          <label>
            <span>ADMIN EMAIL</span>

            <input
              type="email"
              value={email}
              placeholder="Enter admin email"
              autoComplete="username"
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
            />
          </label>

          <label>
            <span>PASSWORD</span>

            <input
              type="password"
              value={password}
              placeholder="Enter password"
              autoComplete="current-password"
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
            />
          </label>

          {error && (
            <div className="admin-login__error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span>AUTHENTICATING...</span>
                <i />
              </>
            ) : (
              <>
                <span>
                  SIGN IN TO DASHBOARD
                </span>

                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        <div className="admin-login__security">
          <ShieldCheck size={16} />

          <span>
            Secure admin area · BARWAL BOX CRICKET
          </span>
        </div>

        <a
          href="/"
          className="admin-login__back"
        >
          ← BACK TO WEBSITE
        </a>

      </div>
    </main>
  );
}

export default AdminLogin;