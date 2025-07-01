import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  addFiles,
  clearFiles,
  removeFile,
} from "../redux/slices/uploaderSlice";
import { useDispatch, useSelector } from "react-redux";

const MAX_FILES = 10;

const Uploader = ({ onClose }) => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.uploader.files);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    const remainingSlots = Math.max(MAX_FILES - files.length, 0);

    if (remainingSlots <= 0) {
      alert(`You can only upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    if (newFiles.length > remainingSlots) {
      alert(`Only ${remainingSlots} file(s) can be added.`);
    }

    dispatch(addFiles(newFiles));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const handleRemoveFile = (index) => {
    dispatch(removeFile(index));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      dispatch(clearFiles());
    };
  }, [dispatch]);

  const borderColor =
    files.length >= MAX_FILES
      ? "border-red-500 bg-red-50"
      : dragActive
      ? "border-blue-500 bg-blue-50"
      : "border-gray-300";

  return (
    <div className="absolute inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-4 border-dashed rounded-xl p-8 text-center bg-white transition-all max-w-[60vw] w-full mx-4 min-h-[55vh] max-h-[60vh] flex flex-col justify-center items-center ${borderColor}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        <div>
          <p className="text-lg mb-4">
            Drag & Drop files here{" "}
            <span className="text-gray-500">(Max {MAX_FILES})</span>
          </p>
          <p className="mb-4 text-gray-500">or</p>
        </div>

        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all">
          Select Files
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </label>

        {files.length > 0 && (
          <div className="mt-6 w-full transition-all duration-150">
            <h2 className="text-xl font-semibold mb-4">Selected Files:</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-40 overflow-auto">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center p-2 rounded-xl bg-gray-50 w-full relative"
                >
                  <span className="truncate text-start w-full pr-8">
                    {file.name}
                  </span>
                  <X
                    className="w-5 h-5 text-red-500 hover:text-red-800 duration-150 cursor-pointer absolute right-2"
                    onClick={() => handleRemoveFile(index)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {files.length >= MAX_FILES && (
          <p className="text-red-500 mt-4 font-medium ">
            Maximum {MAX_FILES} files selected.
          </p>
        )}
      </div>
    </div>
  );
};

export default Uploader;
