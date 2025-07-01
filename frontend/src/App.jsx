import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Uploader from "./pages/Uploader";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  const location = useLocation();
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {location.pathname !== "/login" && (
        <Navbar showUploader={showUploader} setShowUploader={setShowUploader} />
      )}

      {showUploader && <Uploader onClose={() => setShowUploader(false)} />}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default App;
