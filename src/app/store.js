import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import donorReducer from "../features/donors/donorSlice";
import requestReducer from "../features/requests/requestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    donors: donorReducer,
    requests: requestReducer,
  },
});