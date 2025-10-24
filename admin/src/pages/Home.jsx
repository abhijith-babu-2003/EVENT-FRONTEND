import React, { useEffect, useMemo, useState } from "react";
import { FaUsers, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import { eventApi } from "../api/event";
import { bookingApi } from "../api/bookings";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [eventsRes, bookingsRes] = await Promise.all([
          eventApi.getAllEvents(),
          bookingApi.getMyBookings(), // in admin this returns all
        ]);
        if (!mounted) return;
        setEvents(eventsRes?.data || eventsRes || []);
        setBookings(bookingsRes?.bookings || []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const todayISO = new Date().toISOString().slice(0, 10);

  const metrics = useMemo(() => {
    const succeeded = bookings.filter(b => b.paymentStatus === "succeeded");
    const canceled = bookings.filter(b => b.paymentStatus === "canceled");
    const totalTicketsSold = succeeded.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const totalCancellations = canceled.length;

    const uniqueUsers = new Set();
    bookings.forEach(b => {
      if (b.user?._id) uniqueUsers.add(String(b.user._id));
      else if (b.customerEmail) uniqueUsers.add(b.customerEmail);
    });

    const upcomingEvents = (events || []).filter(evt => {
      const d = evt?.date ? new Date(evt.date) : null;
      if (!d) return false;
      const iso = d.toISOString().slice(0,10);
      return iso >= todayISO;
    });

    // Build last 14 days series
    const days = [];
    const map = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0,10);
      days.push(k);
      map[k] = { sold: 0, canceled: 0 };
    }
    bookings.forEach(b => {
      const k = b.createdAt ? new Date(b.createdAt).toISOString().slice(0,10) : null;
      if (!k || !map[k]) return;
      if (b.paymentStatus === 'succeeded') map[k].sold += (b.quantity || 0);
      if (b.paymentStatus === 'canceled') map[k].canceled += 1;
    });

    const daily = days.map(d => ({ date: d, ticketsSold: map[d].sold, cancellations: map[d].canceled }));

    // Recent cancellations
    const recentCancellations = canceled
      .sort((a,b) => new Date(b.updatedAt||b.createdAt) - new Date(a.updatedAt||a.createdAt))
      .slice(0,10);

    return {
      totalUsers: uniqueUsers.size,
      totalEvents: events?.length || 0,
      totalTicketsSold,
      totalCancellations,
      daily,
      recentCancellations,
      upcomingEventsCount: upcomingEvents.length,
    };
  }, [bookings, events, todayISO]);

  const maxSold = Math.max(1, ...metrics.daily.map(d => d.ticketsSold));
  const maxCanc = Math.max(1, ...metrics.daily.map(d => d.cancellations));

  const fmt = (d) => {
    const dd = new Date(d);
    return dd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const pct = (num, max) => {
    const n = Number(num) || 0;
    const m = Number(max) || 1;
    return `${Math.round((Math.max(0, n) / Math.max(1, m)) * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
     
        <aside className="w-64 bg-gray-900 min-h-screen p-6 space-y-6 hidden md:block">
          <div className="h-12 bg-gray-700 rounded-lg"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </aside>

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading dashboard...</div>
          ) : error ? (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">{error}</div>
          ) : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                  <FaUsers size={30} className="text-blue-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Total Users (approx)</h3>
                    <p className="text-2xl font-bold">{metrics.totalUsers}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                  <FaCalendarAlt size={30} className="text-green-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Total Events</h3>
                    <p className="text-2xl font-bold">{metrics.totalEvents}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                  <FaTicketAlt size={30} className="text-yellow-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Tickets Sold</h3>
                    <p className="text-2xl font-bold">{metrics.totalTicketsSold}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                  <FaTicketAlt size={30} className="text-red-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Cancellations</h3>
                    <p className="text-2xl font-bold">{metrics.totalCancellations}</p>
                  </div>
                </div>
              </div>
              {/* No charts or recent lists as requested */}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
