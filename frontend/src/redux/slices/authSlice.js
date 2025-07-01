import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Async Thunk: Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        credentials
      );
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
      return rejectWithValue(
        error.response?.data || { message: "Login failed." }
      );
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        "http://localhost:5001/api/auth/verify-token",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.user; // Assuming user data is returned
    } catch (error) {
      // On failure, logout and clear storage
      localStorage.removeItem("token");
      dispatch(logout());
      toast.error("Session expired. Please login again.");

      return rejectWithValue(
        error.response?.data?.message || "Token verification failed"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
      toast.info("Logged out successfully.");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
