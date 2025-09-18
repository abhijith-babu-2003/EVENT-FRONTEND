import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutUser, fetchUserProfile } from '../redux/slices/userSlice';
import UserProfile from './UserProfile';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="bg-white shadow-md py-4">
      <nav className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-xl font-extrabold text-gray-800">EVENTS CLUB</h1>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <a href="/" className="hover:text-blue-600 font-bold transition">HOME</a>
          </li>
          <li>
            <a href="/events" className="hover:text-blue-600 font-bold transition">EVENTS</a>
          </li>
          <li>
            <a href="/contact" className="hover:text-blue-600 font-bold transition">CONTACT</a>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user && (
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="font-bold text-gray-700 hover:text-blue-600 transition"
                >
                  {user.name || user.username}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition duration-200"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* UserProfile Modal */}
      {isProfileOpen && (
        <UserProfile closeModal={() => setIsProfileOpen(false)} />
      )}
    </header>
  );
};

export default Header;
