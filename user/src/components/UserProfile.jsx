import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUser } from '../redux/slices/userSlice';

const UserProfile = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      closeModal();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative pointer-events-auto">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        {/* User Details */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Profile</h2>
        <div className="mb-6">
          <p><span className="font-semibold">Name:</span> {user?.name}</p>
          <p><span className="font-semibold">Email:</span> {user?.email}</p>
        </div>

        {/* Booking Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
          <p className="text-gray-600">No bookings yet.</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
