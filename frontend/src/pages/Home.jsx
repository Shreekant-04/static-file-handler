import React, { useEffect, useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import ImageGallery from "./ImageGallery";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles } from "../redux/slices/uploaderSlice";

const imageData = [
  {
    filename: "c7285d1996f6b6e7c37dfda1b0c6cef9.jpg",
    contentType: "image/jpeg",
    originalname: "WIN_20250603_21_49_58_Pro.jpg",
    uploadDate: "2025-07-01T15:34:35.610Z",
    length: 263065,
    url: "http://localhost:5001/c7285d1996f6b6e7c37dfda1b0c6cef9.jpg?type=image",
  },
  {
    filename: "0e345f0d6e5f10b0dfc2f1410a18298c.jpg",
    contentType: "image/jpeg",
    originalname: "WIN_20250603_21_50_39_Pro.jpg",
    uploadDate: "2025-07-01T15:33:16.069Z",
    length: 265235,
    url: "http://localhost:5001/0e345f0d6e5f10b0dfc2f1410a18298c.jpg?type=image",
  },
  {
    filename: "2118c69b3919aea9699067ff3a6f07cc.pdf",
    contentType: "application/pdf",
    uploadDate: "2025-07-01T10:51:12.958Z",
    length: 540105,
    url: "http://localhost:5001/2118c69b3919aea9699067ff3a6f07cc.pdf?type=pdf",
  },
  {
    filename: "158f9e5e3ccc1b80d9b38509cc095f43.exe",
    contentType: "application/x-msdos-program",
    uploadDate: "2025-07-01T10:51:12.536Z",
    length: 262336,
    url: "http://localhost:5001/158f9e5e3ccc1b80d9b38509cc095f43.exe?type=other",
  },
  {
    filename: "c04c558092080aaea7186e3b93ba03b9.webp",
    contentType: "image/webp",
    uploadDate: "2025-07-01T10:51:12.505Z",
    length: 258048,
    url: "http://localhost:5001/c04c558092080aaea7186e3b93ba03b9.webp?type=image",
  },
  {
    filename: "84843d7f9a915e36e5f7cd732d52f5ea.pdf",
    contentType: "application/pdf",
    uploadDate: "2025-07-01T10:51:12.346Z",
    length: 44849,
    url: "http://localhost:5001/84843d7f9a915e36e5f7cd732d52f5ea.pdf?type=pdf",
  },
  {
    filename: "ae64fc5caeeca6faaa92d0992f259bf2.pdf",
    contentType: "application/pdf",
    uploadDate: "2025-07-01T10:50:47.777Z",
    length: 540105,
    url: "http://localhost:5001/ae64fc5caeeca6faaa92d0992f259bf2.pdf?type=pdf",
  },
];
const Home = () => {
  const [page, setPage] = useState(1);
  const [bucketName] = useState("all");
  const dispatch = useDispatch();
  const { fetchedFiles = [] } = useSelector((state) => state.uploader);
  // Handle delete image
  const handleDelete = (url) => {
    toast.success("Image deleted Successfully.");
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch(fetchFiles({ page, limit: 10, bucketName }));
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [bucketName, dispatch, page]);
  return (
    <div className="min-h-screen bg-gray-100    ">
      <ImageGallery
        files={fetchedFiles}
        handleDelete={handleDelete}
        setPage={setPage}
      />
    </div>
  );
};

export default Home;
