import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewDonor } from "./donorSlice";
import { addDonorBackend } from "../../services/firebaseService";

const DonorForm = () => {
  // Local form configuration state parameters
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle donor registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify all input criteria are populated before processing
    if (!name || !city || !contact) {
      alert("Validation Error: Please fill in all required fields.");
      return;
    }

    // Construct unified payload with normalized city values for lookup optimization
    const newDonorData = {
      name,
      bloodGroup,
      city: city.trim().toLowerCase(), 
      contact,
      isAvailable
    };

    try {
      // Execute transactional write to the database
      const savedDonor = await addDonorBackend(newDonorData);
      
      // Update application state architecture via Redux dispatch
      dispatch(addNewDonor(savedDonor));
      alert("Registration Successful: You have been registered as an active blood donor.");
      navigate("/donors");
    } catch (error) {
      alert("Registration Failed: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#ffffff" }}>
      <h2 style={{ textAlign: "center", color: "#b22222" }}>🩸 Become a Blood Donor</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Full Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} placeholder="Enter full name" />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Blood Group:</label>
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
          <label style={{ display: "block", marginBottom: "5px" }}>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} placeholder="e.g. London, New York" />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Contact Number:</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} placeholder="e.g. +1234567890" />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input type="checkbox" id="available" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
          <label htmlFor="available" style={{ cursor: "pointer" }}>I am ready to donate blood immediately</label>
        </div>

        <button type="submit" style={{ padding: "10px", background: "#b22222", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          Register as Donor
        </button>
      </form>
    </div>
  );
};

export default DonorForm;