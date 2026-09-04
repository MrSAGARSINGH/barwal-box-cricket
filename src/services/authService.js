const API_URL = 'http://localhost:5000/api';

const TOKEN_KEY = 'barwal_admin_token';
const ADMIN_KEY = 'barwal_admin_data';

export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Invalid email or password.',
      };
    }

    if (!data.token) {
      return {
        success: false,
        error: 'Authentication token was not received.',
      };
    }

    sessionStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    sessionStorage.setItem(
      ADMIN_KEY,
      JSON.stringify(data.admin)
    );

    return {
      success: true,
      admin: data.admin,
      token: data.token,
    };
  } catch (error) {
    console.error('Login API Error:', error);

    return {
      success: false,
      error:
        'Unable to connect to server. Please make sure backend is running.',
    };
  }
};

export const getAdminToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const getAdminData = () => {
  try {
    const admin = sessionStorage.getItem(ADMIN_KEY);

    return admin ? JSON.parse(admin) : null;
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = () => {
  return Boolean(
    sessionStorage.getItem(TOKEN_KEY)
  );
};

export const logoutAdmin = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_KEY);
};

export const getAuthHeaders = () => {
  const token = getAdminToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};