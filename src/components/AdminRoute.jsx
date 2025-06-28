// components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) return null; // Or your loading spinner component

  if (!currentUser) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Logged in but not admin
    return <Navigate to="/" replace />; // Or 403 page
  }

  // Logged in and admin
  return children;
}
