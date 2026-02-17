import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { bootstrapAuth } from "../store/actions/authActions";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const ProtectedRoute: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, bootstrapStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (bootstrapStatus !== "idle") return;
    dispatch(bootstrapAuth());
  }, [bootstrapStatus, dispatch]);

  if (isAuthenticated) {
    return <Outlet />;
  }

  if (bootstrapStatus === "loading" || bootstrapStatus === "idle") {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
