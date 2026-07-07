import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./features/auth/Login";
import UserDashboard from "./features/donors/UserDashboard";
import SearchDonors from "./features/donors/SearchDonors";
import DonorForm from "./features/donors/DonorForm";
import RequestForm from "./features/requests/RequestForm";
import ViewRequests from "./features/requests/ViewRequests";
import AdminDashboard from "./features/admin/AdminDashboard";
import { logoutSuccess } from "./features/auth/authSlice";
import { logoutUserBackend } from "./services/firebaseService";

// --- Clean Landing Page View ---
const LandingPage = () => (
  <div style={{ padding: "50px 20px", textAlign: "center", background: "#fdf2f2", minHeight: "80vh" }}>
    <h1 style={{ fontSize: "2.5rem", color: "#c53030" }}>🩸 Blood Bank Network Management</h1>
    <p style={{ fontSize: "1.2rem", color: "#4a5568", maxWidth: "600px", margin: "20px auto" }}>
      A secure decentralized platform to bridge the gap between active blood donors and urgent emergency requests instantly.
    </p>
    <div style={{ marginTop: "30px" }}>
      {/* Yahan par error fixed kar diya hai */}
      <Link to="/login" style={{ padding: "12px 25px", background: "#c53030", color: "white", textDecoration: "none", borderRadius: "5px", fontWeight: "bold", fontSize: "1.1rem" }}>
        Get Started (Login / Register)
      </Link>
    </div>
  </div>
);

// Main Navbar Component
const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutUserBackend();
      dispatch(logoutSuccess());
      alert("Logged out successfully!");
    } catch (error) {
      alert("Logout fail: " + error.message);
    }
  };
  
  return (
    <nav style={{ background: "#fff", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.08)", borderBottom: "3px solid #e53e3e" }}>
      <div>
        <Link to="/" style={{ fontWeight: "bold", fontSize: "1.3rem", textDecoration: "none", color: "#c53030", marginRight: "25px" }}>🩸 BloodBank</Link>
        {isAuthenticated && (
          <>
            <Link to="/dashboard" style={{ marginRight: "15px", textDecoration: "none", color: "#4a5568" }}>Dashboard</Link>
            <Link to="/donors" style={{ marginRight: "15px", textDecoration: "none", color: "#4a5568" }}>Search Donors</Link>
            <Link to="/donate" style={{ marginRight: "15px", textDecoration: "none", color: "#4a5568" }}>Become Donor</Link>
            <Link to="/requests" style={{ marginRight: "15px", textDecoration: "none", color: "#4a5568" }}>Urgent Requests</Link>
            <Link to="/request" style={{ marginRight: "15px", textDecoration: "none", color: "#4a5568" }}>Post Request</Link>
            {user?.role === "admin" && <Link to="/admin" style={{ color: "red", fontWeight: "bold", textDecoration: "none" }}>🛠️ Admin Panel</Link>}
          </>
        )}
      </div>
      <div>
        {!isAuthenticated ? (
          <Link to="/login" style={{ textDecoration: "none", background: "#c53030", color: "white", padding: "6px 15px", borderRadius: "4px" }}>Login / Signup</Link>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "14px", color: "#4a5568" }}>Welcome, <strong>{user?.name}</strong> <span style={{ textTransform: "uppercase", fontSize: "11px", background: "#fed7d7", color: "#c53030", padding: "2px 6px", borderRadius: "4px" }}>{user?.role}</span></span>
            <button onClick={handleLogout} style={{ background: "#4a5568", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/donors" element={<ProtectedRoute><SearchDonors /></ProtectedRoute>} />
        <Route path="/donate" element={<ProtectedRoute><DonorForm /></ProtectedRoute>} />
        <Route path="/request" element={<ProtectedRoute><RequestForm /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><ViewRequests /></ProtectedRoute>} />

        {/* Admin Section */}
        <Route path="/admin" element={
          <ProtectedRoute allowAdminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;