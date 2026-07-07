import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requestsList: [],
  loading: false,
  error: null,
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequestsStart: (state) => {
      state.loading = true;
    },
    setRequestsSuccess: (state, action) => {
      state.loading = false;
      state.requestsList = action.payload;
    },
    setRequestsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Nayi request UI mein add karne ke liye
    addNewRequest: (state, action) => {
      state.requestsList.push(action.payload);
    },
    // Request fulfilled mark karne ke liye state update
    markRequestFulfilled: (state, action) => {
      const request = state.requestsList.find((r) => r.id === action.payload.id);
      if (request) {
        request.isFulfilled = action.payload.isFulfilled;
      }
    },
  },
});

export const { 
  setRequestsStart, 
  setRequestsSuccess, 
  setRequestsFailure, 
  addNewRequest, 
  markRequestFulfilled 
} = requestSlice.actions;

export default requestSlice.reducer;