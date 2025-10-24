import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, X, AlertCircle, CheckCircle } from 'lucide-react';
import { bookingApi } from '../api/bookings';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [notification, setNotification] = useState(null);

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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const data = await bookingApi.cancelBooking(bookingId);
      
      if (data.alreadyCanceled) {
        showNotification('This booking was already cancelled', 'info');
      } else {
        showNotification('Booking cancelled successfully', 'success');
      }
      
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, paymentStatus: 'canceled' }
          : booking
      ));
    } catch (err) {
      console.error('Cancel booking error:', err);
      showNotification(
        err.response?.data?.message || 'Failed to cancel booking',
        'error'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your event tickets and bookings</p>
        </div>

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
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {booking.event?.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={booking.event.image}
                      alt={booking.event.eventName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                    <span className="text-sm text-gray-500">
                      Booked: {formatDate(booking.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {booking.event?.eventName || 'Event Name Not Available'}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{formatDate(booking.event?.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{booking.event?.time || 'Time TBA'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{booking.event?.location || 'Location TBA'}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Section:</span>
                      <span className="font-medium text-gray-800">{booking.section}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium text-gray-800">{booking.quantity} ticket(s)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Price:</span>
                      <span className="font-bold text-gray-800">
                        {formatCurrency(booking.totalPrice, booking.currency)}
                      </span>
                    </div>
                    {booking.customerName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-800">{booking.customerName}</span>
                      </div>
                    )}
                  </div>

                  {booking.paymentStatus === 'succeeded' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {cancellingId === booking._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Cancel Booking
                        </>
                      )}
                    </button>
                  )}

                  {booking.paymentStatus === 'canceled' && (
                    <div className="mt-4 text-center text-sm text-gray-500">
                      This booking has been cancelled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
