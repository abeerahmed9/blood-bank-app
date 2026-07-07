import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDonorsStart, setDonorsSuccess, setDonorsFailure } from "./donorSlice";
import { getDonorsWithFallback } from "../../services/jsonService";
import DonorCard from "./DonorCard";

const SearchDonors = () => {
  const dispatch = useDispatch();
  const { donorsList, loading } = useSelector((state) => state.donors);

  // Local filter states for simple student-level logic
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const loadDonors = async () => {
      dispatch(setDonorsStart());
      try {
        const data = await getDonorsWithFallback();
        dispatch(setDonorsSuccess(data));
      } catch (error) {
        dispatch(setDonorsFailure(error.message));
      }
    };
    loadDonors();
  }, [dispatch]);

  // Bilkul basic filter logic jo student khud likhta hai
  const filteredDonors = donorsList.filter((donor) => {
    const matchGroup = selectedGroup === "" || donor.bloodGroup === selectedGroup;
    const matchCity = selectedCity === "" || donor.city.includes(selectedCity.toLowerCase().trim());
    return matchGroup && matchCity;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#b22222", textAlign: "center" }}>🔍 Search Compatible Blood Donors</h2>

      {/* Simple Filter Panel */}
      <div style={{ display: "flex", gap: "15px", justifyContent: "center", margin: "20px 0", padding: "15px", background: "#f5f5f5", borderRadius: "6px" }}>
        <div>
          <label style={{ marginRight: "8px" }}>Blood Group:</label>
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} style={{ padding: "5px" }}>
            <option value="">All Groups</option>
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
          <label style={{ marginRight: "8px" }}>City Name:</label>
          <input 
            type="text" 
            placeholder="e.g. karachi" 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)} 
            style={{ padding: "5px" }}
          />
        </div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading donors list...</p>}

      {/* Donor Cards Grid */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {filteredDonors.length === 0 ? (
          <p>Bhai, is filter ke mutabiq koi donor nahi mila.</p>
        ) : (
          filteredDonors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchDonors;