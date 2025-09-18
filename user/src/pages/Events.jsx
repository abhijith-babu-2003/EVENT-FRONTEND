import React, { useEffect, useState } from 'react';


const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventApi.getAllEvents();
        setEvents(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading events...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Artist:</span> {event.artistName}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Time:</span> {event.time}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Budget:</span> ${event.budget}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
