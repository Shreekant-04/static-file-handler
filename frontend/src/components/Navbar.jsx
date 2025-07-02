import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Navbar = ({ setShowUploader }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout sucessfully");
    navigate("/login");
  };
  return (
    <nav className="flex justify-between items-center bg-blue-500 text-white px-6 py-4 shadow-lg">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Assets
      </h1>
      <div className="flex gap-4">
        {location.pathname === "/" && (
          <button
            onClick={() => setShowUploader(true)}
            className="bg-white text-blue-500 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all"
          >
            {"Upload"}
          </button>
        )}
        <div
          onClick={handleLogout}
          className="bg-white text-blue-500 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all cursor-pointer"
        >
          Logout
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
