import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDonorsStart, setDonorsSuccess, setDonorsFailure } from "./donorSlice";
import { setRequestsStart, setRequestsSuccess, setRequestsFailure } from "../requests/requestSlice";
import { getDonorsWithFallback } from "../../services/jsonService";
import { getRequestsBackend } from "../../services/firebaseService";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const dispatch = useDispatch();
  
  // Redux states se data nikal rahe hain
  const { donorsList } = useSelector((state) => state.donors);
  const { requestsList } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Donors load karne ka function
    const loadDashboardData = async () => {
      dispatch(setDonorsStart());
      dispatch(setRequestsStart());
      try {
        const donorsData = await getDonorsWithFallback();
        dispatch(setDonorsSuccess(donorsData));

        const requestsData = await getRequestsBackend();
        dispatch(setRequestsSuccess(requestsData));
      } catch (error) {
        dispatch(setDonorsFailure(error.message));
        dispatch(setRequestsFailure(error.message));
      }
    };
    loadDashboardData();
  }, [dispatch]);

  // Standard 8 Blood Groups ki list
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Har blood group ke available donors count karne ki simple student logic
  const getStockCount = (group) => {
    let count = 0;
    for (let i = 0; i < donorsList.length; i++) {
      if (donorsList[i].bloodGroup === group && donorsList[i].isAvailable) {
        count++;
      }
    }
    return count;
  };

  // Active (unfulfilled) requests count karne ke liye
  const activeRequestsCount = requestsList.filter(r => !r.isFulfilled).length;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Welcome Banner */}
      <div style={{ background: "#fff5f5", borderLeft: "5px solid #e53e3e", padding: "15px", marginBottom: "30px", borderRadius: "4px" }}>
        <h2>Hello, {user?.name || "User"}! 👋</h2>
        <p>Welcome to your Blood Bank control center. Here is the live overview of available blood donors stock.</p>
      </div>

      {/* Main Stats Counter Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={{ background: "#ebf8ff", padding: "20px", borderRadius: "8px", flex: "1", minWidth: "200px", textAlign: "center", border: "1px solid #bee3f8" }}>
          <h3 style={{ margin: "0", color: "#2b6cb0" }}>{donorsList.length}</h3>
          <p style={{ margin: "5px 0 0 0", color: "#4a5568" }}>👥 Total Registered Donors</p>
        </div>
        <div style={{ background: "#fffaf0", padding: "20px", borderRadius: "8px", flex: "1", minWidth: "200px", textAlign: "center", border: "1px solid #feebc8" }}>
          <h3 style={{ margin: "0", color: "#dd6b20" }}>{activeRequestsCount}</h3>
          <p style={{ margin: "5px 0 0 0", color: "#4a5568" }}>🚨 Active Urgent Requests</p>
        </div>
      </div>

      {/* Blood Stock Grid Section */}
      <h3 style={{ color: "#c53030", borderBottom: "2px solid #fed7d7", paddingBottom: "10px" }}>🩸 Live Blood Availability Stock (Available Donors Count)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px", marginTop: "20px" }}>
        {bloodGroups.map((group) => {
          const stock = getStockCount(group);
          return (
            <div key={group} style={{
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "15px",
              textAlign: "center",
              background: stock > 0 ? "#f7fafc" : "#fff5f5", // Agar stock zero ho toh alert tint dikhega
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <h1 style={{ margin: "0", color: "#e53e3e" }}>{group}</h1>
              <p style={{ margin: "5px 0 0 0", fontWeight: "bold", color: stock > 0 ? "#2f855a" : "#c53030" }}>
                {stock > 0 ? `${stock} Donors Online` : "Out of Stock"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Links */}
      <div style={{ marginTop: "40px", textAlign: "center", background: "#f7fafc", padding: "20px", borderRadius: "8px" }}>
        <h4>Need Urgent Help or Want to Donate?</h4>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "10px" }}>
          <Link to="/request" style={{ padding: "10px 15px", background: "#e53e3e", color: "white", textDecoration: "none", borderRadius: "4px", fontWeight: "bold" }}>🚨 Post Urgent Request</Link>
          <Link to="/donate" style={{ padding: "10px 15px", background: "#2f855a", color: "white", textDecoration: "none", borderRadius: "4px", fontWeight: "bold" }}>🤝 Become a Donor</Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;