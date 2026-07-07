import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowAdminOnly = false }) => {
  // Redux store se user ka login status aur role utha rahe hain
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Agar user logged in nahi hai, toh use login page par bhej do
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Agar yeh page sirf admin ke liye hai aur login user admin nahi hai, toh user dashboard par bhej do
  if (allowAdminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Agar sab theek hai, toh page dikha do
  return children;
};

export default ProtectedRoute;