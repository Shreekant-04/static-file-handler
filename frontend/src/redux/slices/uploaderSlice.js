// src/redux/slices/uploaderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
import Pagination from "../../components/Pagination";

// Async thunk to upload files
export const uploadMultipleFiles = createAsyncThunk(
  "files/uploadMultiple",
  async (_, { getState, rejectWithValue }) => {
    const { files } = getState().uploader; // Access files from state
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file); // ensure your backend accepts this key
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/files/upload/multiple`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Files uploaded successfully.");
      return response.data;
    } catch (error) {
      toast.error("File upload failed.");
      return rejectWithValue(error.response?.data || "File upload failed");
    }
  }
);

export const fetchFiles = createAsyncThunk(
  "files/fetchAll",
  async ({ page = 1, limit = 10, bucketName = "all" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/files`,
        {
          params: {
            page,
            limit,
            bucketName,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch files.");
    }
  }
);

// Initial state
const initialState = {
  files: [],
  fetchedFiles: [],
  pagination: {},
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Slice
const uploaderSlice = createSlice({
  name: "uploader",
  initialState,
  reducers: {
    addFiles: (state, action) => {
      const newFiles = action.payload;
      const remainingSlots = Math.max(10 - state.files.length, 0);

      if (remainingSlots <= 0) {
        toast.error("Maximum 10 files allowed.");
        return;
      }

      if (newFiles.length > remainingSlots) {
        toast.warn(`Only ${remainingSlots} file(s) can be added.`);
      }

      const filesToAdd = newFiles.slice(0, remainingSlots);
      state.files = [...state.files, ...filesToAdd];

      if (filesToAdd.length > 0) {
        toast.success(`${filesToAdd.length} file(s) added successfully.`);
      }
    },

    removeFile: (state, action) => {
      const removedFile = state.files[action.payload]?.name;
      state.files = state.files.filter((_, index) => index !== action.payload);
      toast.info(`${removedFile || "File"} removed.`);
    },

    clearFiles: (state) => {
      state.files = [];
      toast.info("All files cleared.");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(uploadMultipleFiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadMultipleFiles.fulfilled, (state) => {
        state.status = "succeeded";
        state.files = []; // Clear files after successful upload
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong.";
      })
      .addCase(fetchFiles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fetchedFiles = action.payload?.files || [];
        state.pagination = action.payload?.pagination || {};
        state.total = action.payload?.total || 0;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load files.";
      });
  },
});

export const { addFiles, removeFile, clearFiles } = uploaderSlice.actions;
export default uploaderSlice.reducer;
