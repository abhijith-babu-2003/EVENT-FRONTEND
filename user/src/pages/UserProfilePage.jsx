import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../redux/slices/userSlice";
import { paymentApi } from "../api/payment";
import { FiUser, FiCreditCard, FiCalendar, FiLogOut, FiPlus, FiDollarSign, FiClock, FiMapPin, FiX, FiMaximize2 } from "react-icons/fi";
import { QRCodeSVG } from 'qrcode.react';

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [addAmount, setAddAmount] = useState("");
  const [addingMoney, setAddingMoney] = useState(false);
  const fetchedRef = useRef(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getMyBookings();
      // Handle different possible response formats
      const bookingsData = res.bookings || res.data?.bookings || res.data || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      // Set wallet balance if returned in the response
      if (res.walletBalance !== undefined) {
        setWalletBalance(res.walletBalance);
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
      const msg = (
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load bookings"
      ).toString();
      const isExpired =
        msg.toLowerCase().includes("token expired") ||
        msg.toLowerCase().includes("unauthorized") ||
        err?.response?.status === 401;

      if (isExpired) {
        toast.error("Session expired. Please log in again.");
        try {
          await dispatch(logoutUser()).unwrap();
        } catch (_) {}
        return;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    const amount = parseFloat(addAmount);
    if (!addAmount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setAddingMoney(true);
    try {
      // TODO: Integrate with actual API, e.g., await paymentApi.addToWallet(amount);
      // For now, simulate with optimistic update and refetch
      setWalletBalance((prev) => prev + amount);
      toast.success(`₹${amount} added to wallet successfully`);
      setAddAmount("");
      // Optionally refetch to sync with backend
      // await fetchBookings();
    } catch (err) {
      console.error("Add money error:", err);
      toast.error(err?.message || "Failed to add money");
      // Revert optimistic update if needed
      // await fetchBookings();
    } finally {
      setAddingMoney(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await paymentApi.cancelBooking(id);
      toast.success("Booking canceled successfully");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, paymentStatus: "canceled" } : b
        )
      );
    } catch (err) {
      toast.error(err?.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setBookings([]);
      setWalletBalance(0);
      setLoading(false);
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchBookings();
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            My Account
          </h1>
          <p className="text-gray-600">Manage your profile, wallet, and bookings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3">
                  <FiUser className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Profile Information
                </h2>
              </div>
              <div className="space-y-5 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-semibold text-lg">
                    {user?.name || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 break-all">
                    {user?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors duration-200"
                >
                  <FiLogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-white/20 rounded-lg mr-3">
                    <FiCreditCard className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Wallet Balance</h2>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-4xl font-bold mb-1">
                  ₹{walletBalance?.toLocaleString('en-IN') || '0'}
                </p>
                <p className="text-blue-100 text-sm">Available Balance</p>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="100"
                      placeholder="Enter amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                      disabled={addingMoney}
                    />
                    {addAmount && (
                      <button 
                        onClick={() => setAddAmount('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleAddMoney}
                    disabled={addingMoney || !addAmount}
                    className="w-full mt-3 flex items-center justify-center gap-2 bg-white text-blue-700 px-4 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPlus className="w-5 h-5" />
                    {addingMoney ? 'Adding...' : 'Add Money'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Booking Card */}
          {bookings.length > 0 && (
            <div className="md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Upcoming Event
              </h3>

              <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {bookings[0]?.event?.image ? (
                  <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                    <img
                      src={bookings[0].event.image}
                      alt={bookings[0].event.eventName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white line-clamp-1">
                        {bookings[0].event.eventName}
                      </h3>
                      <p className="text-sm text-blue-100">
                        {bookings[0].event.artistName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4 flex items-center justify-center">
                    <FiCalendar className="w-10 h-10 text-white opacity-80" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm">
                      {bookings[0]?.event?.date 
                        ? new Date(bookings[0].event.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Date not specified'}
                    </span>
                  </div>
                  
                  {bookings[0]?.event?.time && (
                    <div className="flex items-center text-gray-600">
                      <FiClock className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{bookings[0].event.time}</span>
                    </div>
                  )}
                  
                  {bookings[0]?.event?.location && (
                    <div className="flex items-start text-gray-600">
                      <FiMapPin className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                      <span className="text-sm line-clamp-2">{bookings[0].event.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4">
                  <button 
                    onClick={() => handleCancel(bookings[0]._id)}
                    disabled={bookings[0]?.paymentStatus === 'canceled'}
                    className={`w-full text-center py-2 text-sm rounded-lg font-medium transition-colors ${
                      bookings[0]?.paymentStatus === 'canceled'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {bookings[0]?.paymentStatus === 'canceled' ? 'Cancelled' : 'Cancel Booking'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full-width Bookings Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3">
                  <FiCalendar className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  My Bookings
                </h2>
              </div>
              <div className="mt-3 md:mt-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full md:w-64"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                  <p className="text-gray-500">Loading your bookings...</p>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="mt-1 text-gray-500 max-w-md mx-auto">
                  You don't have any upcoming events. Start by exploring our events and book your tickets!
                </p>
                <button
                  onClick={() => navigate('/events')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="md:flex">
                      <div className="md:flex-shrink-0 md:w-48 h-40 bg-gray-100 relative overflow-hidden">
                        {booking.event?.image ? (
                          <img
                            className="w-full h-full object-cover"
                            src={booking.event.image}
                            alt={booking.event.eventName}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                            <FiCalendar className="w-10 h-10 text-blue-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.paymentStatus === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.paymentStatus?.charAt(0).toUpperCase() + booking.paymentStatus?.slice(1) || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex-1">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                  {booking.event?.eventName || 'Event name not available'}
                                </h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-blue-600 font-medium">
                                    {booking.event?.artistName || 'Artist not specified'}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600 text-sm">
                                    {booking.section ? `${booking.section} Section` : 'General Admission'}
                                  </span>
                                </div>
                              </div>
                              <div className="relative group">
                                <div className="flex items-center space-x-2">
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500">Booking ID</div>
                                    <div className="text-sm font-medium text-gray-900">#{booking._id.slice(-6).toUpperCase()}</div>
                                  </div>
                                  <div className="relative">
                                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                                      <FiMaximize2 className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="absolute right-0 top-10 z-10 hidden group-hover:block p-2 bg-white rounded-lg shadow-lg border border-gray-200">
                                      <QRCodeSVG 
                                        value={booking._id}
                                        size={80}
                                        level="H"
                                        includeMargin={true}
                                      />
                                      <div className="text-xs text-center mt-1 text-gray-500">#{booking._id.slice(-6).toUpperCase()}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-gray-500">Date</div>
                                <div className="font-medium">
                                  {booking.event?.date
                                    ? new Date(booking.event.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })
                                    : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500">Time</div>
                                <div className="font-medium">
                                  {booking.event?.time || 'Not specified'}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500">Location</div>
                                <div className="font-medium">
                                  {booking.event?.location || 'Venue not specified'}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500">Seats</div>
                                <div className="font-medium">
                                  {booking.quantity || 1} {booking.quantity === 1 ? 'seat' : 'seats'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <div>
                              <span className="text-gray-500 text-sm">Total</span>
                              <div className="text-lg font-bold">
                                ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
                              </div>
                            </div>
                            <div className="space-x-3">
                              <button
                                onClick={() => handleCancel(booking._id)}
                                disabled={booking.paymentStatus === 'canceled'}
                                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                                  booking.paymentStatus === 'canceled'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                              >
                                {booking.paymentStatus === 'canceled' ? 'Cancelled' : 'Cancel Booking'}
                              </button>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
