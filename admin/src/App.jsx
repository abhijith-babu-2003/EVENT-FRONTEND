import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Events from "./pages/Events";

import Bookings from "./pages/Bookings";
import { selectAdminAuth } from "./redux/slices/adminSlice";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectAdminAuth);
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route  path="/admin/bookings" element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App;
