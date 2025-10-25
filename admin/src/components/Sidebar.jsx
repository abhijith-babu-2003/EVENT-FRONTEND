// Sidebar.jsx
import React, { useState } from 'react';
import { FaUsers, FaCalendarAlt, FaTicketAlt, FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../redux/slices/adminSlice';
import { adminApi } from '../api/admin';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await adminApi.logoutAdmin();
      dispatch(logout());
      toast.success("Logout successful!");
      navigate('/login');
      setIsMobileOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-black min-h-screen p-6 space-y-6 hidden md:block">
        <h1 className="text-xl font-bold text-white mb-8">Admin Panel</h1>
        {isAuthenticated && (
          <nav className="space-y-4">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive 
                  ? "flex items-center space-x-3 text-yellow-400 font-semibold bg-gray-700 p-3 rounded" 
                  : "flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded transition"
              }
              onClick={closeMobileMenu}
            >
              <FaUsers size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/admin/events"
              className={({ isActive }) =>
                isActive 
                  ? "flex items-center space-x-3 text-yellow-400 font-semibold bg-gray-700 p-3 rounded" 
                  : "flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded transition"
              }
              onClick={closeMobileMenu}
            >
              <FaCalendarAlt size={20} />
              <span>Events</span>
            </NavLink>
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                isActive 
                  ? "flex items-center space-x-3 text-yellow-400 font-semibold bg-gray-700 p-3 rounded" 
                  : "flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded transition"
              }
              onClick={closeMobileMenu}
            >
              <FaTicketAlt size={20} />
              <span>Bookings</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded transition mt-4"
            >
              Logout
            </button>
          </nav>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-40 p-2 bg-black text-white rounded-md md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Mobile Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-black z-50 p-6 space-y-6 transform transition-transform duration-300 ease-in-out md:hidden">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-white hover:text-gray-300"
              >
                <FaTimes size={20} />
              </button>
            </div>
            {isAuthenticated && (
              <nav className="space-y-4">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    isActive 
                      ? "flex items-center space-x-3 text-yellow-400 font-semibold bg-gray-700 p-3 rounded" 
                      : "flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded transition"
                  }
                  onClick={closeMobileMenu}
                >
                  <FaUsers size={20} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/admin/events"
                  className={({ isActive }) =>
                    isActive 
                      ? "flex items-center space-x-3 text-yellow-400 font-semibold bg-gray-700 p-3 rounded" 
                      : "flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded transition"
                  }
                  onClick={closeMobileMenu}
                >
                  <FaCalendarAlt size={20} />
                  <span>Events</span>
                </NavLink>
                <NavLink
                  to="/admin/bookings"
                  className={({ isActive }) =>
                    isActive 
                      ? "flex items-center space-x-3 text-yellow-400 font-semibold bg-gray-700 p-3 rounded" 
                      : "flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded transition"
                  }
                  onClick={closeMobileMenu}
                >
                  <FaTicketAlt size={20} />
                  <span>Bookings</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded transition mt-4"
                >
                  Logout
                </button>
              </nav>
            )}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;