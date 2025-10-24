import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventApi } from "../api/event";

const CheckOut = () => {
  const {eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postcode: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await eventApi.getEventById(eventId);
        // API returns { data: event }
        setEvent(res.data);
      } catch (err) {
        setError(err?.message || err?.response?.data?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  const [selectedSection, setSelectedSection] = useState("");




  const totalAvailable = useMemo(() => {
    if (!event?.seats) return 0;
    return event.seats.reduce((sum, s) => sum + (s.available || 0), 0);
  }, [event]);

  const sectionOptions = useMemo(() => event?.seats || [], [event]);
  const selectedSeatPrice = useMemo(() => {
    const sec = sectionOptions.find((s) => s.section === selectedSection);
    return sec?.price || 0;
  }, [sectionOptions, selectedSection]);
  const selectedSectionAvailable = useMemo(() => {
    const sec = sectionOptions.find((s) => s.section === selectedSection);
    return sec?.available || 0;
  }, [sectionOptions, selectedSection]);

  // Initialize selected section after event load
  useEffect(() => {
    if (sectionOptions.length && !selectedSection) {
      setSelectedSection(sectionOptions[0].section);
    }
  }, [sectionOptions, selectedSection]);

  
  
  

  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-white bg-black">
        <div className="bg-red-900 border-l-4 border-red-600 p-4 rounded-md">
          <p className="text-sm font-medium text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="bg-black text-white min-h-screen w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full min-w-0">
          {/* Event Summary */}
          <div className="lg:col-span-2 bg-black border border-white/20 rounded-lg overflow-hidden min-w-0">
            {event.image && (
              <img src={event.image} alt={event.eventName} className="w-full h-64 object-cover" />
            )}
            <div className="p-5">
              <h2 className="text-2xl font-semibold">{event.eventName}</h2>
              <div className="mt-3 space-y-1 text-gray-300">
                <p>
                  <span className="font-medium text-white">Artist:</span> {event.artistName}
                </p>
                <p>
                  <span className="font-medium text-white">Date:</span> {new Date(event.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-white">Time:</span> {event.time}
                </p>
                <p>
                  <span className="font-medium text-white">Location:</span> {event.location}
                </p>
                <p className="font-semibold text-white mt-2">
                  Total Available Seats: {totalAvailable}
                </p>
              </div>

              {/* Quantity selection */}
              <div className="mt-6">
                <label className="block text-sm text-gray-300 mb-2">Tickets</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="px-3 py-1 rounded border border-white/30 disabled:opacity-50"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={selectedSectionAvailable || 1}
                    value={quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value || 1, 10);
                      setQuantity(Math.min(Math.max(1, v), selectedSectionAvailable || 1));
                    }}
                    className="w-20 bg-black border border-white/20 rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    className="px-3 py-1 rounded border border-white/30 disabled:opacity-50"
                    onClick={() => setQuantity((q) => Math.min((selectedSectionAvailable || 1), q + 1))}
                    disabled={quantity >= (selectedSectionAvailable || 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Seat Section Selection */}
              <div className="mt-4">
                <label className="block text-sm text-gray-300 mb-2">Seat Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="bg-black border border-white/20 rounded px-3 py-2"
                >
                  {sectionOptions.map((s) => (
                    <option key={s.section} value={s.section}>
                      {s.section} — ₹{s.price} ({s.available} left)
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Summary */}
              <div className="mt-6 text-gray-200">
                <div className="flex justify-between">
                  <span>Price per ticket</span>
                  <span>₹{selectedSeatPrice}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="h-px bg-white/10 my-3" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{selectedSeatPrice * quantity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Details + Payment (Online only via Stripe) */}
          <div className="bg-black border border-white/20 rounded-lg p-5 h-fit min-w-0 overflow-hidden">
            <h3 className="text-xl font-semibold mb-4">Billing Details</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2"
                    placeholder="Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1 text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1 text-gray-300">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2"
                    placeholder="123 Street Name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Country</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2"
                    placeholder="India"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">State</label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2"
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Postcode</label>
                  <input
                    name="postcode"
                    value={form.postcode}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2"
                    placeholder="400001"
                  />
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Payment</h4>
                <div className="flex items-center gap-3 text-gray-300">
                  <input type="radio" checked readOnly />
                  <span>Online Payment (Stripe)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full mt-2 px-4 py-2 rounded-lg border border-white/30 hover:border-white/60"
              >
                Back
              </button>
            </form>

            {/* Continue to Payment Page */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  const isFormValid = Object.values(form).every((v) => String(v).trim().length > 0);
                  if (!isFormValid || quantity < 1 || selectedSectionAvailable === 0 || !selectedSeatPrice) return;
                  navigate('/payment', {
                    state: {
                      eventId,
                      eventName: event.eventName,
                      image: event.image,
                      section: selectedSection,
                      unitPrice: selectedSeatPrice,
                      quantity,
                      email: form.email,
                      customerName: `${form.firstName} ${form.lastName}`.trim(),
                    },
                  });
                }}
                disabled={Object.values(form).some((v) => String(v).trim().length === 0) || quantity < 1 || selectedSectionAvailable === 0}
                className={`w-full px-4 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                  Object.values(form).some((v) => String(v).trim().length === 0) || quantity < 1 || selectedSectionAvailable === 0
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg'
                }`}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;

