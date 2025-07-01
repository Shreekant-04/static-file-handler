import React, { useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import ImageGallery from "./ImageGallery";
import Navbar from "../components/Navbar";

const imageData = [
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
  const [images, setImages] = useState(imageData);
  // Handle delete image
  const handleDelete = (imageToDelete) => {
    const updatedImages = images.filter(
      (img) => img.filename !== imageToDelete.filename
    );
    setImages(updatedImages);
    toast.success("Image deleted Successfully.");
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ImageGallery files={images} handleDelete={handleDelete} />
    </div>
  );
};

export default Home;
