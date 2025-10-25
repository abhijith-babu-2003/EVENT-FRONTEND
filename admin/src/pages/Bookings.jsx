import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, X, AlertCircle, CheckCircle } from 'lucide-react';
import { FiMaximize2 } from "react-icons/fi";
import { QRCodeSVG } from 'qrcode.react';
import { bookingApi } from '../api/bookings'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Sidebar from '../components/Sidebar'

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingApi.getMyBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Cancel this booking?',
      text: "This action will mark the booking as canceled.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it',
    });

    if (!result.isConfirmed) return;

    try {
      setCancellingId(bookingId);
      const data = await bookingApi.cancelBooking(bookingId);

      const canceledTime = data?.booking?.updatedAt || new Date().toISOString();

      if (data.alreadyCanceled) {
        const msg = `This booking was already cancelled. Last updated at ${formatDateTime(canceledTime)}`;
        showNotification(msg, 'info');
        toast.info(msg);
      } else {
        const msg = `Booking cancelled successfully at ${formatDateTime(canceledTime)}`;
        showNotification(msg, 'success');
        toast.success(msg);
      }

      // Update local state (also record canceledAt for display)
      setBookings(bookings.map(booking =>
        booking._id === bookingId
          ? { ...booking, paymentStatus: 'canceled', canceledAt: canceledTime }
          : booking
      ));
    } catch (err) {
      console.error('Cancel booking error:', err);
      const errMsg = err.response?.data?.message || 'Failed to cancel booking';
      showNotification(errMsg, 'error');
      toast.error(errMsg);
    } finally {
      setCancellingId(null);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format date & time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
              <p className="text-gray-600">Manage your event tickets and bookings</p>
            </div>

            {/* Notification */}
            {notification && (
              <div className={`mb-6 p-4 rounded-lg flex items-start ${
                notification.type === 'success' ? 'bg-green-50 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 text-red-800' :
                'bg-blue-50 text-blue-800'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <p>{notification.message}</p>
              </div>
            )}

            {/* Empty state */}
            {bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
                <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring events!</p>
                <a
                  href="/events"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Events
                </a>
              </div>
            ) : (
              /* Bookings grid */
              <div className="grid gap-4 md:grid-cols-3">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Event image */}
                    {booking.event?.image && (
                      <div className="h-32 overflow-hidden">
                        <img
                          src={booking.event.image}
                          alt={booking.event.eventName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      {/* Status badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.paymentStatus === 'succeeded' 
                            ? 'bg-green-100 text-green-800'
                            : booking.paymentStatus === 'canceled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentStatus === 'succeeded' ? 'Confirmed' :
                           booking.paymentStatus === 'canceled' ? 'Cancelled' :
                           booking.paymentStatus}
                        </span>
                        <span className="text-xs text-gray-500">
                          Booked: {formatDate(booking.createdAt)}
                        </span>
                      </div>

                      {/* Event details */}
                      <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2">
                        {booking.event?.eventName || 'Event Name Not Available'}
                      </h3>

                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-3 h-3 mr-1.5 flex-shrink-0" />
                          <span className="text-xs">{formatDate(booking.event?.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
                          <span className="text-xs">{booking.event?.time || 'Time TBA'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
                          <span className="text-xs">{booking.event?.location || 'Location TBA'}</span>
                        </div>
                      </div>

                      {/* Booking info */}
                      <div className="border-t pt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Section:</span>
                          <span className="font-medium text-gray-800">{booking.section}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium text-gray-800">{booking.quantity} ticket(s)</span>
                        </div>
                        <div className="flex justify-between items-start text-xs">
                          <span className="text-gray-600">Booking ID:</span>
                          <div className="flex items-center space-x-2 flex-1 justify-end">
                            <span className="font-medium text-gray-800">#{booking._id.slice(-6).toUpperCase()}</span>
                            <div className="relative group">
                              <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer ml-1">
                                <FiMaximize2 className="w-3 h-3 text-gray-500" />
                              </div>
                              <div className="absolute right-0 top-full z-10 hidden group-hover:block p-2 bg-white rounded-lg shadow-lg border border-gray-200 mt-1">
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
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Total Price:</span>
                          <span className="font-bold text-gray-800">
                            {formatCurrency(booking.totalPrice, booking.currency)}
                          </span>
                        </div>
                        {booking.customerName && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-800">{booking.customerName}</span>
                          </div>
                        )}
                      </div>

                      {/* Cancel button */}
                      {booking.paymentStatus === 'succeeded' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="mt-3 w-full bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                        >
                          {cancellingId === booking._id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 mr-1.5" />
                              Cancel Booking
                            </>
                          )}
                        </button>
                      )}

                      {booking.paymentStatus === 'canceled' && (
                        <div className="mt-3 text-center text-xs text-gray-500">
                          This booking has been cancelled{booking.canceledAt || booking.updatedAt ? ` at ${formatDateTime(booking.canceledAt || booking.updatedAt)}` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Bookings;