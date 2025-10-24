import React, { useEffect, useState } from "react";
import { eventApi } from "../api/event";
import { paymentApi } from "../api/payment";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchName, setSearchName] = useState("");
  const [artistFilter, setArtistFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [artists, setArtists] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await eventApi.getAllEvents();
        setEvents(response.data);
        setFilteredEvents(response.data);

        const uniqueArtists = [
          ...new Set(response.data.map((event) => event.artistName)),
        ];
        setArtists(uniqueArtists);
      } catch (err) {
        console.error("Error in fetchEvents:", err);
        setError(err.response?.data?.message || "Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Handle Stripe redirect result once: confirm booking -> toast -> clean URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectStatus = params.get("redirect_status");
    const paymentIntentId = params.get("payment_intent");

    const shouldHandle =
      (redirectStatus === "succeeded" && !!paymentIntentId) ||
      redirectStatus === "failed" ||
      redirectStatus === "canceled";
    if (!shouldHandle) return;

    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("redirect_status");
      url.searchParams.delete("payment_intent");
      url.searchParams.delete("payment_intent_client_secret");
      window.history.replaceState({}, document.title, url.pathname);
    };

    // Idempotency guard to avoid double toasts under StrictMode / remounts
    const storageKey = `stripe_pi_processed_${paymentIntentId || "none"}`;
    if (sessionStorage.getItem(storageKey)) {
      cleanUrl();
      return;
    }
    sessionStorage.setItem(storageKey, "1");

    (async () => {
      if (redirectStatus === "succeeded" && paymentIntentId) {
        try {
          await paymentApi.confirmBooking(paymentIntentId);
          toast.success("Payment successful! Booking confirmed.");
        } catch (err) {
          const msg = err?.response?.data?.message || "Payment succeeded, but booking confirmation failed.";
          toast.error(msg);
        } finally {
          cleanUrl();
        }
      } else if (redirectStatus === "failed" || redirectStatus === "canceled") {
        toast.error("Payment was not completed.");
        cleanUrl();
      }
    })();
  }, [location.search]);

  useEffect(() => {
    let filtered = [...events];
    
    // Enhanced search functionality - searches in event name, artist name, and location
    if (searchName) {
      const searchTerm = searchName.toLowerCase();
      filtered = filtered.filter(event => 
        event.eventName.toLowerCase().includes(searchTerm) ||
        event.artistName.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
      );
    }
    
    if (artistFilter) {
      filtered = filtered.filter(event => event.artistName === artistFilter);
    }
    
    // Improved date filtering with proper timezone handling
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set to start of day
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Normalize to start of day
        return eventDate >= start;
      });
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(23, 59, 59, 999); // Normalize to end of day
        return eventDate <= end;
      });
    }
    
    setFilteredEvents(filtered);
  }, [searchName, artistFilter, startDate, endDate, events]);

  const handleReset = () => {
    setSearchName("");
    setArtistFilter("");
    setStartDate("");
    setEndDate("");
    setFilteredEvents(events);
  };

  const handleCardClick = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);
  const goToCheckout = (e, id) => {
    e.stopPropagation();
    navigate(`/checkout/${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-black text-white">
        <div className="bg-red-900 border-l-4 border-red-600 p-4 rounded-md">
          <p className="text-sm font-medium text-red-200">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="bg-black text-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-white/20 rounded-lg px-4 py-2 w-full sm:w-1/4 bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
        <select
          value={artistFilter}
          onChange={(e) => setArtistFilter(e.target.value)}
          className="border border-white/20 rounded-lg px-4 py-2 w-full sm:w-1/4 bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="">All Artists</option>
          {artists.map((artist) => (
            <option key={artist} value={artist}>
              {artist}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-white/20 rounded-lg px-4 py-2 w-full sm:w-1/4 bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-white/20 rounded-lg px-4 py-2 w-full sm:w-1/4 bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          onClick={handleReset}
          className="bg-black border border-white/20 px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition duration-200"
        >
          Reset Filters
        </button>
      </div>

      {/* Events */}
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-400">No events found for the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              onClick={() => handleCardClick(event)}
              className="bg-black border border-white/20 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.eventName}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                <p className="text-gray-300 mb-1">
                  <span className="font-medium">Artist:</span> {event.artistName}
                </p>
                <p className="text-gray-300 mb-1">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-300 mb-1">
                  <span className="font-medium">Time:</span> {event.time}
                </p>
                <p className="text-gray-300 mb-1">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="font-bold text-white">
                    Total Seats: {event.seats.reduce((sum, seat) => sum + seat.available, 0)}
                  </p>
                  <button
                    className={`px-6 py-2 rounded-lg font-semibold ${
                      event.seats.reduce((sum, seat) => sum + seat.available, 0) === 0
                        ? "bg-gray-700 cursor-not-allowed text-gray-300"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                    disabled={event.seats.reduce((sum, seat) => sum + seat.available, 0) === 0}
                    onClick={(e) => goToCheckout(e, event._id)}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal}></div>
          <div className="relative bg-black w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg z-50 text-white">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {selectedEvent.image && (
              <img
                src={selectedEvent.image}
                alt={selectedEvent.eventName}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <h2 className="text-2xl font-bold mb-2">{selectedEvent.eventName}</h2>
            <p className="text-gray-300 mb-1">
              <strong>Artist:</strong> {selectedEvent.artistName}
            </p>
            <p className="text-gray-300 mb-1">
              <strong>Date:</strong>{" "}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </p>
            <p className="text-gray-300 mb-1">
              <strong>Time:</strong> {selectedEvent.time}
            </p>
            <p className="text-gray-300 mb-1">
              <strong>Location:</strong> {selectedEvent.location}
            </p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Available Seats</h3>
              <p className="font-bold text-xl">
                Total Available Seats:{" "}
                {selectedEvent.seats.reduce((sum, seat) => sum + seat.available, 0)}
              </p>
              <button
                disabled={selectedEvent.seats.reduce((sum, seat) => sum + seat.available, 0) === 0}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  selectedEvent.seats.reduce((sum, seat) => sum + seat.available, 0) === 0
                    ? "bg-gray-700 cursor-not-allowed text-gray-300"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
                onClick={(e) => goToCheckout(e, selectedEvent._id)}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Events;
