import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  donorsList: [],
  loading: false,
  error: null,
  // Filtering ke liye simple states
  filters: {
    bloodGroup: "",
    city: "",
    availability: "all", // all, available, unavailable
  },
};

const donorSlice = createSlice({
  name: "donors",
  initialState,
  reducers: {
    setDonorsStart: (state) => {
      state.loading = true;
    },
    // Firebase ya JSON server se aaye hue saare donors save karne ke liye
    setDonorsSuccess: (state, action) => {
      state.loading = false;
      state.donorsList = action.payload;
    },
    setDonorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Naya donor list mein add karne ke liye
    addNewDonor: (state, action) => {
      state.donorsList.push(action.payload);
    },
    // Donor ki availability toggle (change) karne ke liye
    toggleDonorAvailability: (state, action) => {
      const donor = state.donorsList.find((d) => d.id === action.payload.id);
      if (donor) {
        donor.isAvailable = action.payload.isAvailable;
      }
    },
    // Admin agar koi entry delete kare
    removeDonor: (state, action) => {
      state.donorsList = state.donorsList.filter((d) => d.id !== action.payload);
    },
    // Filters set karne ke liye function
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { 
  setDonorsStart, 
  setDonorsSuccess, 
  setDonorsFailure, 
  addNewDonor, 
  toggleDonorAvailability,
  removeDonor,
  updateFilters 
} = donorSlice.actions;

export default donorSlice.reducer;