import { configureStore } from "@reduxjs/toolkit";
import uploaderReducer from "./slices/uploaderSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    uploader: uploaderReducer,
  },
});

export default store;
