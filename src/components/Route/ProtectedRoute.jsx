// src/components/Route/ProtectedRoute.jsx - COMPLETE FIX
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "../../store/slices/authSlice";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user, initialized } = useSelector(
    (state) => state.auth
  );
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // If we have stored auth but haven't verified with server yet
      if (isAuthenticated && !initialized) {
        try {
          await dispatch(getUserProfile()).unwrap();
        } catch (error) {
          console.error("Session verification failed:", error);
        }
      }
      setChecking(false);
    };

    verifyAuth();
  }, [dispatch, isAuthenticated, initialized]);

  // Show loading spinner while checking authentication
  if (checking || (isAuthenticated && !initialized)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b7521d]"></div>
          <p className="mt-4 text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If admin-only route and user is not admin, redirect to home
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
