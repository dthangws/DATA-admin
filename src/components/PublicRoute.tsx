import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PublicRoute: React.FC = () => {
  const auth = useAuth();

  return auth?.isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
