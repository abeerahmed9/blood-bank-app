import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDonorsStart, setDonorsSuccess, setDonorsFailure, removeDonor } from "../donors/donorSlice";
import { getDonorsBackend, deleteDonorBackend } from "../../services/firebaseService";
import DonorCard from "../donors/DonorCard";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { donorsList, loading } = useSelector((state) => state.donors);

  useEffect(() => {
    const loadDonors = async () => {
      dispatch(setDonorsStart());
      try {
        const data = await getDonorsBackend();
        dispatch(setDonorsSuccess(data));
      } catch (error) {
        dispatch(setDonorsFailure(error.message));
      }
    };
    loadDonors();
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this record from the database?")) {
      try {
        await deleteDonorBackend(id);
        dispatch(removeDonor(id));
        alert("Success: Record has been successfully deleted from the repository.");
      } catch (error) {
        alert("Operation Failed: Error encountered during record deletion: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "20px", background: "#ffffff", borderRadius: "8px" }}>
      <h2 style={{ color: "#d9534f" }}>🛠️ Admin Management Control Panel</h2>
      <p style={{ color: "#555" }}>Welcome to the Administrative Control Console. Unauthorized data sanitization and diagnostic structural cleanups are securely handled from this module.</p>
      
      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "20px 0" }} />
      
      <h3>👥 All Registered Donors Database ({donorsList.length})</h3>
      {loading && <p style={{ fontStyle: "italic", color: "#888" }}>Loading database synchronization logs...</p>}
      
      <div style={{ marginTop: "20px" }}>
        {donorsList.map((donor) => (
          <DonorCard key={donor.id} donor={donor} isAdmin={true} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;