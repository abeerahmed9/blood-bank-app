import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "./authSlice";
import { loginUserBackend, registerUserBackend } from "../../services/firebaseService";

const Login = () => {
  // Local state management for form input fields
  const [isSignup, setIsSignup] = useState(false); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Extracting authentication state from Redux store
  const { loading } = useSelector((state) => state.auth);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic frontend validations
    if (!email || !password) {
      alert("Please enter both email and password initialization values.");
      return;
    }
    if (isSignup && !name) {
      alert("Please provide your full name to complete registration.");
      return;
    }

    dispatch(loginStart());

    try {
      let userData;
      if (isSignup) {
        // Execute dynamic user account registration on Firebase backend
        userData = await registerUserBackend(email, password, name, role);
        alert("Account registered successfully! Redirecting to secure profile initialization...");
      } else {
        // Execute normal user authorization process
        userData = await loginUserBackend(email, password);
      }

      // Synchronize backend data with Redux store state and redirect
      dispatch(loginSuccess(userData));
      navigate("/dashboard");
    } catch (err) {
      dispatch(loginFailure(err.message));
      
      // 🛠️ DEVELOPER LOG: System error code will be securely logged in the browser console
      console.error("Firebase Internal Authentication Log:", err.code || "N/A", err.message);

      // 👥 USER FRIENDLY ALERTS: Dynamic mapping based on Firebase error codes
      let userFriendlyMessage = "Authentication failed. Please verify your connection and try again.";

      // Custom check for credential errors or missing instances
      if (
        err.code === "auth/invalid-credential" || 
        err.code === "auth/wrong-password" || 
        err.code === "auth/user-not-found" ||
        err.message.includes("invalid-credential")
      ) {
        userFriendlyMessage = "Invalid email or password. Please verify your credentials and try again.";
      } else if (err.code === "auth/email-already-in-use" || err.message.includes("email-already-in-use")) {
        userFriendlyMessage = "This email address is already registered. Please login instead.";
      } else if (err.code === "auth/weak-password" || err.message.includes("weak-password")) {
        userFriendlyMessage = "Password security criteria not met. Password should be at least 6 characters long.";
      } else if (err.code === "auth/network-request-failed") {
        userFriendlyMessage = "Network latency or disconnection detected. Please check your internet connection.";
      } else if (err.code === "auth/too-many-requests") {
        userFriendlyMessage = "Account temporarily locked due to multiple failed attempts. Please try again later.";
      }

      // Display the clean, polished message to the user interface via an alert popup
      alert(userFriendlyMessage);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", color: "#b22222" }}>
        {isSignup ? "🩸 Create Blood Bank Account" : "🩸 Login to Blood Bank"}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        
        {/* Render Name Field Conditionally based on Signup State */}
        {isSignup && (
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Full Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Email Address:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="example@mail.com"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="******"
          />
        </div>

        {/* Conditional Role Selection Options for Testing Configurations */}
        {isSignup && (
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Account Role:</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="user">Normal User (Donor/Recipient)</option>
              <option value="admin">Administrator (Admin Panel Access)</option>
            </select>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: "10px", background: "#b22222", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span 
          onClick={() => setIsSignup(!isSignup)} 
          style={{ color: "#0056b3", cursor: "pointer", textDecoration: "underline" }}
        >
          {isSignup ? "Login here" : "Register here"}
        </span>
      </p>
    </div>
  );
};

export default Login;