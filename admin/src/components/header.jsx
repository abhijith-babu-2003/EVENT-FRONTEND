import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../redux/slices/adminSlice';
import { adminApi } from '../api/admin';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  const handleLogout = async () => {
    try {
      await adminApi.logoutAdmin();
      dispatch(logout());
      toast.success("Logout successful!");
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>

        {isAuthenticated && (
          <nav className="flex space-x-6 items-center">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-300"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/events"
              className={({ isActive }) =>
                isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-300"
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-300"
              }
            >
              Bookings
            </NavLink>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
