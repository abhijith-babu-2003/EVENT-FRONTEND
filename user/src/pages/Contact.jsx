import React, { useState } from "react";
import { FaMusic, FaUserAlt, FaEnvelope, FaPhoneAlt, FaCity } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import page from "../assets/contactpage.jpg"; 
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    city: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info("Thanks for reaching out! We'll get back to you soon 🎶")
    setFormData({ name: "", email: "", number: "", city: "", message: "" });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
      {/* Left Side Image */}
      <div className="lg:w-1/2 w-full h-64 sm:h-80 lg:h-full">
        <img src={page} alt="Music Event" className="w-full h-full object-cover" />
      </div>

      {/* Right Side Form */}
      <div className="flex justify-center items-start lg:items-center lg:w-1/2 w-full p-4 sm:p-6 lg:p-8">
        <div className="bg-white text-black shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg">
          <div className="flex flex-col items-center mb-6">
            <FaMusic className="w-10 h-10 sm:w-12 sm:h-12 text-black mb-2" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center">Contact Us</h2>
            <p className="text-gray-700 text-xs sm:text-sm text-center mt-2 px-2">
              Have questions about the <span className="font-semibold">Music Fest</span>?  
              Reach out for ticketing, sponsorships, or volunteering 🎶
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Name */}
            <div className="flex items-center border border-black rounded-xl px-3">
              <FaUserAlt className="text-gray-500 mr-2 flex-shrink-0" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 focus:outline-none text-sm"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-black rounded-xl px-3">
              <FaEnvelope className="text-gray-500 mr-2 flex-shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 focus:outline-none text-sm"
              />
            </div>

            {/* Phone Number */}
            <div className="flex items-center border border-black rounded-xl px-3">
              <FaPhoneAlt className="text-gray-500 mr-2 flex-shrink-0" />
              <input
                type="tel"
                name="number"
                placeholder="Your Number"
                value={formData.number}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 focus:outline-none text-sm"
              />
            </div>

            {/* City */}
            <div className="flex items-center border border-black rounded-xl px-3">
              <FaCity className="text-gray-500 mr-2 flex-shrink-0" />
              <input
                type="text"
                name="city"
                placeholder="Your City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 focus:outline-none text-sm"
              />
            </div>

            {/* Message */}
            <div className="flex items-start border border-black rounded-xl px-3">
              <FiMessageSquare className="text-gray-500 mt-2 sm:mt-3 mr-2 flex-shrink-0" />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 focus:outline-none h-24 sm:h-32 text-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 sm:py-3 rounded-xl hover:bg-white hover:text-black border border-black transition font-semibold text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;