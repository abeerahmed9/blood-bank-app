import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewRequest } from "./requestSlice";
import { addRequestBackend } from "../../services/firebaseService";

const RequestForm = () => {
  // Local UI state parameters for tracking medical request parameters
  const [patientName, setPatientName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [hospital, setHospital] = useState("");
  const [contact, setContact] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle systemic broadcast submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify critical field entries exist prior to dispatching async actions
    if (!patientName || !hospital || !contact) {
      alert("Validation Error: Patient documentation and facility logistics are required.");
      return;
    }

    const newRequest = {
      patientName,
      bloodGroup,
      hospital,
      contact,
      isFulfilled: false
    };

    try {
      // Execute transactional network sync with database persistence engine
      const savedRequest = await addRequestBackend(newRequest);
      
      // Update globally centralized state container via Redux architectures
      dispatch(addNewRequest(savedRequest));
      alert("Success: Urgent blood request has been successfully broadcasted.");
      navigate("/requests");
    } catch (error) {
      alert("Transaction Failed: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#ffffff" }}>
      <h2 style={{ textAlign: "center", color: "#721c24" }}>🚨 Post Urgent Blood Request</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Patient Name:</label>
          <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} placeholder="Enter patient name" />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Blood Group Required:</label>
          <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Hospital Name & City:</label>
          <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} placeholder="e.g. City General Hospital" />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Contact Number:</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} placeholder="e.g. +1234567890" />
        </div>
        <button type="submit" style={{ padding: "10px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          Broadcast Blood Request
        </button>
      </form>
    </div>
  );
};

export default RequestForm;