import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('agent_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    // Check if expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('agent_token');
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (err) {
    localStorage.removeItem('agent_token');
    return <Navigate to="/login" replace />;
  }
}
