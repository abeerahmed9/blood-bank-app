import { createSlice } from "@reduxjs/toolkit";

// Initializing state directly from localStorage to survive page refreshes
const savedUser = localStorage.getItem("blood_bank_user");
const parsedUser = savedUser ? JSON.parse(savedUser) : null;

const initialState = {
  user: parsedUser,
  isAuthenticated: parsedUser !== null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      
      // Save authenticated user payload session inside browser storage
      localStorage.setItem("blood_bank_user", JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Purge session tokens upon structural user logout
      localStorage.removeItem("blood_bank_user");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;