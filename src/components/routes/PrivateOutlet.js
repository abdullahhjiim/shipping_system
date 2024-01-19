import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivetOutlet() {
  const authData = useSelector((state) => state.auth);
  const { _token } = authData;

  return _token ? <Outlet /> : <Navigate to="/login" />;
}
