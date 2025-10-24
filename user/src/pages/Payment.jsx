import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { paymentApi } from "../api/payment";
import { toast } from "react-toastify";

const PaymentForm = ({ email }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [localEmail, setLocalEmail] = useState(email || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/events`,
        receipt_email: localEmail || email || undefined,
      },
      redirect: "always",
    });
    if (error) {
      alert(error.message || "Payment failed");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Receipt email</label>
        <input
          type="email"
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-black border border-white/20 rounded px-3 py-2"
        />
      </div>

      <div className="p-4 border border-white/15 rounded-lg bg-black overflow-hidden">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={!stripe || !elements || submitting}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors duration-200 ${
            !stripe || !elements || submitting
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg'
          }`}
        >
          {submitting ? "Processing..." : "Pay Now"}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-3 rounded-xl border border-white/30 hover:border-white/60"
        >
          Back to Checkout
        </button>
      </div>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stripePromise = useMemo(
    () =>
      loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY|| "", {
        // Disables Stripe telemetry/fraud beacon requests (e.g., r.stripe.com)
        // Useful in dev when ad blockers cause console noise; consider enabling in prod for best fraud detection.
        advancedFraudSignals: false,
      }),
    []
  );

  const state = location.state || {};
  const { eventId, eventName, image, section, unitPrice, quantity, email, customerName } = state;

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please login to continue with payment");
          navigate('/login', { state: { from: location.pathname, state: location.state } });
          return;
        }

        if (!eventId || !unitPrice || !quantity || quantity < 1) {
          toast.error("Missing payment details. Please start from checkout again.");
          navigate('/events');
          return;
        }
        
        setError("");
        setLoading(true);
        
        const amountInPaise = Math.round(Number(unitPrice) * Number(quantity) * 100);
        const res = await paymentApi.createIntent({
          amount: amountInPaise,
          currency: "inr",
          metadata: { 
            eventId, 
            section, 
            qty: String(quantity), 
            customerName: (customerName || "").trim() 
          },
        });
        
        if (res.clientSecret) {
          setClientSecret(res.clientSecret);
        } else {
          throw new Error("Failed to get client secret from server");
        }
      } catch (err) {
        console.error("Payment init failed:", err);
        const errorMessage = err?.response?.data?.message || 
                           err?.message || 
                           "Failed to initialize payment";
        setError(errorMessage);
        toast.error(errorMessage);
        
        // If it's an auth error, redirect to login
        if (err?.response?.status === 401) {
          navigate('/login', { state: { from: location.pathname, state: location.state } });
        }
      } finally {
        setLoading(false);
      }
    };
    
    init();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [eventId, section, unitPrice, quantity, navigate, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-white bg-black">
        <div className="bg-red-900 border-l-4 border-red-600 p-4 rounded-md">
          <p className="text-sm font-medium text-red-200">{error}</p>
        </div>
        <button
          onClick={() => navigate("/events")}
          className="mt-4 px-4 py-2 rounded-lg border border-white/30 hover:border-white/60"
        >
          Go to Events
        </button>
      </div>
    );
  }

  if (!clientSecret) return null;

  const total = Number(unitPrice) * Number(quantity);

  return (
    <div className="bg-black text-white min-h-screen w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Complete your payment</h1>
          <p className="text-gray-400 mt-1 break-words">Secure checkout powered by Stripe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full min-w-0">
          {/* Summary Card */}
          <div className="lg:col-span-1 bg-black border border-white/20 rounded-lg overflow-hidden h-fit max-w-full min-w-0">
            {image && <img src={image} alt={eventName} className="w-full h-44 object-cover" />}
            <div className="p-5">
              <h2 className="text-xl font-semibold break-words">{eventName}</h2>
              <div className="mt-3 text-gray-300 space-y-1 break-words">
                <p><span className="text-white font-medium">Section:</span> {section}</p>
                <p><span className="text-white font-medium">Tickets:</span> {quantity}</p>
                <div className="h-px bg-white/10 my-3" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="lg:col-span-2 bg-black border border-white/20 rounded-lg p-5 h-fit w-full max-w-full min-w-0 overflow-hidden">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
              <PaymentForm email={email} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
