import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  files: [],
};

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
    },
  },
});

export const { addFiles, removeFile, clearFiles } = uploaderSlice.actions;
export default uploaderSlice.reducer;
