// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner"; // ✅ Import your spinner

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // ✅ Show spinner while Firebase is checking auth state
  if (loading) return <LoadingSpinner />;

  // ✅ If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/Login" replace />;
  }

  // ✅ If logged in, show the protected content
  return children;
}

export default ProtectedRoute;
