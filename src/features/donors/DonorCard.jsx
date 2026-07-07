import React from "react";

const DonorCard = ({ donor, isAdmin = false, onDelete }) => {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "6px",
      padding: "15px",
      margin: "10px",
      background: donor.isAvailable ? "#e6fffa" : "#ffebee", // Available ke liye green background, unavailable ke liye red tint
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      display: "inline-block",
      width: "250px",
      verticalAlign: "top"
    }}>
      <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{donor.name}</h4>
      <p style={{ margin: "5px 0" }}><strong>Blood Group:</strong> <span style={{ color: "red", fontWeight: "bold" }}>{donor.bloodGroup}</span></p>
      <p style={{ margin: "5px 0" }}><strong>City:</strong> {donor.city}</p>
      <p style={{ margin: "5px 0" }}><strong>Contact:</strong> {donor.contact}</p>
      <p style={{ margin: "5px 0" }}>
        <strong>Status:</strong> {donor.isAvailable ? "✅ Available to Donate" : "❌ Temporarily Unavailable"}
      </p>

      {/* Agar admin dekh raha hai toh use delete karne ka button dikhega */}
      {isAdmin && (
        <button 
          onClick={() => onDelete(donor.id)}
          style={{
            marginTop: "10px",
            width: "100%",
            background: "red",
            color: "white",
            border: "none",
            padding: "5px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Delete Entry
        </button>
      )}
    </div>
  );
};

export default DonorCard;