import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { loading, isAuthed, user } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  if (roles?.length && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

