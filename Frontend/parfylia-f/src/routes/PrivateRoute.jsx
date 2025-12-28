import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Chargement...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}
