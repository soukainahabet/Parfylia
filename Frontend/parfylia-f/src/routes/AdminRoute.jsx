import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

