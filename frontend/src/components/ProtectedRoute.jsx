import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Nبa3thou l login w nتفكrou el page eli kan ye7eb yemchilha
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}