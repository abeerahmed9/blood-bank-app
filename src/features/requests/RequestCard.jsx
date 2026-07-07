import React from "react";

const RequestCard = ({ request, onMarkFulfilled, currentRole }) => {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      margin: "15px auto",
      maxWidth: "500px",
      background: request.isFulfilled ? "#e2e3e5" : "#fff3cd", // Fulfilled ke liye grey, active ke liye warning-yellow
      borderLeft: request.isFulfilled ? "5px solid #6c757d" : "5px solid #ffc107"
    }}>
      <h3 style={{ margin: "0 0 10px 0", color: "#856404" }}>Patient: {request.patientName}</h3>
      <p><strong>Required Blood Group:</strong> <span style={{ color: "red", fontWeight: "bold" }}>{request.bloodGroup}</span></p>
      <p><strong>Hospital Name:</strong> {request.hospital}</p>
      <p><strong>Contact Info:</strong> {request.contact}</p>
      <p><strong>Status:</strong> {request.isFulfilled ? "✅ Fulfilled / Managed" : "🚨 Urgent - Need Help!"}</p>
      
      {/* Agar request active hai, aur login banda admin hai, tabhi button dikhega */}
      {!request.isFulfilled && currentRole === "admin" && (
        <button
          onClick={() => onMarkFulfilled(request.id)}
          style={{
            marginTop: "10px",
            background: "#28a745",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Mark as Fulfilled
        </button>
      )}
    </div>
  );
};

export default RequestCard;