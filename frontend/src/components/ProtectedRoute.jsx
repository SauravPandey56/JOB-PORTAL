import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { loading, isAuthed, user } = useAuth();
  if (loading) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

