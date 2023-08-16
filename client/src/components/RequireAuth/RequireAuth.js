import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext/AuthContext";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export default RequireAuth;
