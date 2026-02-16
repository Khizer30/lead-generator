import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../store/hooks";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, bootstrapStatus } = useAppSelector((state) => state.auth);

  if (bootstrapStatus === "loading") {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
