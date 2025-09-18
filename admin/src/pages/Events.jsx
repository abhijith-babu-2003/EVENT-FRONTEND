import React, { useState, useEffect } from "react";
import AddEventModal from "../components/AddEventModal";
import { eventApi } from "../api/event";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Events = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await eventApi.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      setLoading(true);
      setError("");

      if (editingEvent) {
        const response = await eventApi.updateEvent(editingEvent._id, eventData);
        setEvents(
          events.map((evt) =>
            evt._id === editingEvent._id ? response.data : evt
          )
        );
        toast.success("Event updated successfully!");
        setEditingEvent(null);
      } else {
        const response = await eventApi.createEvent(eventData);
        setEvents([response.data, ...events]);
        toast.success("Event created successfully!");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      setError(
        error.response?.data?.message || "Failed to save event. Please try again."
      );
      toast.error(error.response?.data?.message || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        setError("");
        await eventApi.deleteEvent(id);
        setEvents(events.filter((evt) => evt._id !== id));
        toast.success("Event deleted successfully!");
        Swal.fire("Deleted!", "Your event has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting event:", error);
        setError("Failed to delete event. Please try again.");
        toast.error("Failed to delete event. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      setError("");
      const response = await eventApi.updateEventStatus(id, newStatus);
      setEvents(
        events.map((evt) =>
          evt._id === id ? { ...evt, status: newStatus } : evt
        )
      );
      toast.success("Event status updated successfully!");
    } catch (error) {
      console.error("Error updating event status:", error);
      setError("Failed to update event status. Please try again.");
      toast.error("Failed to update event status.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 disabled:opacity-50"
          disabled={loading}
        >
          Add New Event
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleAddEvent}
        initialData={editingEvent}
        loading={loading}
      />

      {loading && !isModalOpen ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-4 border-b">Event Name</th>
                <th className="text-left py-2 px-4 border-b">Artist</th>
                <th className="text-left py-2 px-4 border-b">Date</th>
                <th className="text-left py-2 px-4 border-b">Time</th>
                <th className="text-left py-2 px-4 border-b">Budget</th>
                <th className="text-left py-2 px-4 border-b">Location</th>
                <th className="text-left py-2 px-4 border-b">Status</th>
                <th className="text-left py-2 px-4 border-b">Seats</th>
                <th className="text-left py-2 px-4 border-b">Image</th>
                <th className="text-left py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    No events added yet.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b font-medium">
                      {event.eventName}
                    </td>
                    <td className="py-2 px-4 border-b">{event.artistName}</td>
                    <td className="py-2 px-4 border-b">
                      {formatDate(event.date)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {formatTime(event.time)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      ${event.budget.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">{event.location}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={event.status}
                        onChange={(e) =>
                          handleStatusChange(event._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded text-xs font-medium border ${
                          event.status === "Scheduled"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : event.status === "Completed"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        } focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50`}
                        disabled={loading}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="space-y-1">
                        {event.seats.map((seat) => (
                          <div key={seat.section} className="text-sm">
                            <span className="font-medium">{seat.section}:</span>{" "}
                            {seat.available}Seats Price ${seat.price}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt="Event"
                          className="w-24 h-16 object-cover rounded border"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "block";
                          }}
                        />
                      ) : (
                        <div className="w-24 h-16 bg-gray-200 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm disabled:opacity-50"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Events;