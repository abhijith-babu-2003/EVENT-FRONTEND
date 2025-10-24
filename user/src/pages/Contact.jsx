import React, { useState } from "react";
import { FaMusic, FaUserAlt, FaEnvelope, FaPhoneAlt, FaCity } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import page from "../assets/contactpage.jpg"; 

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
    console.log("Form submitted:", formData);
    alert("Thanks for reaching out! We'll get back to you soon 🎶");
    setFormData({ name: "", email: "", number: "", city: "", message: "" });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Left Side Image */}
      <div className="md:w-1/2 w-full">
        <img src={page} alt="Music Event" className="w-full h-full object-cover" />
      </div>

      {/* Right Side Form */}
      <div className="flex justify-center items-center md:w-1/2 w-full p-8">
        <div className="bg-white text-black shadow-2xl rounded-2xl p-8 w-full max-w-lg">
          <div className="flex flex-col items-center mb-6">
            <FaMusic className="w-12 h-12 text-black mb-2" />
            <h2 className="text-3xl font-extrabold text-center">Contact Us</h2>
            <p className="text-gray-700 text-sm text-center mt-2">
              Have questions about the <span className="font-semibold">Music Fest</span>?  
              Reach out for ticketing, sponsorships, or volunteering 🎶
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="flex items-center border border-black rounded-xl px-3">
              <FaUserAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-black rounded-xl px-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div className="flex items-center border border-black rounded-xl px-3">
              <FaPhoneAlt className="text-gray-500 mr-2" />
              <input
                type="tel"
                name="number"
                placeholder="Your Number"
                value={formData.number}
                onChange={handleChange}
                required
                className="w-full p-3 focus:outline-none"
              />
            </div>

            {/* City */}
            <div className="flex items-center border border-black rounded-xl px-3">
              <FaCity className="text-gray-500 mr-2" />
              <input
                type="text"
                name="city"
                placeholder="Your City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-3 focus:outline-none"
              />
            </div>

            {/* Message */}
            <div className="flex items-start border border-black rounded-xl px-3">
              <FiMessageSquare className="text-gray-500 mt-3 mr-2" />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 focus:outline-none h-32"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-white hover:text-black border border-black transition font-semibold"
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
