import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, verifyToken } from "../redux/slices/authSlice";
import {FadeLoader} from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    const verify = async () => {
      try {
        await dispatch(verifyToken()).unwrap();
      } catch (error) {
        console.log(error);
        dispatch(logout());
        navigate("/login");
      }
    };
    if (token || savedToken) {
      verify();
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FadeLoader />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
