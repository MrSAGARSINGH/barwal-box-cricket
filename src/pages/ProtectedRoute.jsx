import { Navigate } from 'react-router-dom';

import {
  isAdminAuthenticated,
} from '../services/authService';

function ProtectedRoute({ children }) {
  const authenticated =
    isAdminAuthenticated();

  if (!authenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;