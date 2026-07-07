import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRequestsStart, setRequestsSuccess, setRequestsFailure, markRequestFulfilled } from "./requestSlice";
import { getRequestsBackend, updateRequestStatusBackend } from "../../services/firebaseService";
import RequestCard from "./RequestCard";

const ViewRequests = () => {
  const dispatch = useDispatch();
  const { requestsList, loading } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth); // Role check karne ke liye

  useEffect(() => {
    const fetchRequests = async () => {
      dispatch(setRequestsStart());
      try {
        const data = await getRequestsBackend();
        dispatch(setRequestsSuccess(data));
      } catch (error) {
        dispatch(setRequestsFailure(error.message));
      }
    };
    fetchRequests();
  }, [dispatch]);

  const handleFulfilled = async (id) => {
    try {
      await updateRequestStatusBackend(id, true);
      dispatch(markRequestFulfilled({ id, isFulfilled: true }));
      alert("Status updated successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#dc3545" }}>📢 Active Emergency Blood Requests</h2>
      {loading && <p style={{ textAlign: "center" }}>Loading requests...</p>}
      <div style={{ marginTop: "20px" }}>
        {requestsList.length === 0 ? (
          <p style={{ textAlign: "center" }}>Sukoon hai! Abhi koi active urgent blood request nahi hai.</p>
        ) : (
          requestsList.map((req) => (
            <RequestCard key={req.id} request={req} onMarkFulfilled={handleFulfilled} currentRole={user?.role} />
          ))
        )}
      </div>
    </div>
  );
};

export default ViewRequests;