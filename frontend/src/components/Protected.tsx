import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store";

export const Protected = () => {
  const location = useLocation();
  const auth = useAuth((state) => state.auth);
  if (auth && auth.access_token) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace state={{ ru: location.pathname }}></Navigate>;
};
