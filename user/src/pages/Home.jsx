import React from 'react';
import bg from '../assets/BG.JPG';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <img 
          src={bg} 
          alt="Hero Background" 
          className="w-full h-full object-cover brightness-50" 
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Discover Amazing Events</h1>
          <p className="text-lg md:text-2xl mb-6">Book tickets, join experiences, and enjoy live events near you.</p>
          <Link 
            to="/events"
            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition duration-200"
          >
            Browse Events
          </Link>
        </div>
      </div>

      {/* Featured Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Featured Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Example Event Card */}
            <div className="bg-black shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition duration-200">
              <img 
                src="https://source.unsplash.com/400x300/?concert,music" 
                alt="Event" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-white">Live Music Concert</h3>
                <p className="text-gray-300 mb-4">Join us for a night of live music featuring top artists in your city.</p>
                <Link 
                  to="/events" 
                  className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition duration-200"
                >
                  Book Now
                </Link>
              </div>
            </div>

            <div className="bg-black shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition duration-200">
              <img 
                src="https://source.unsplash.com/400x300/?festival,music" 
                alt="Event" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-white">Summer Music Festival</h3>
                <p className="text-gray-300 mb-4">Experience the biggest music festival of the summer with multiple stages.</p>
                <Link 
                  to="/events" 
                  className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition duration-200"
                >
                  Book Now
                </Link>
              </div>
            </div>

            <div className="bg-black shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition duration-200">
              <img 
                src="https://source.unsplash.com/400x300/?band,concert" 
                alt="Event" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-white">Rock Band Live</h3>
                <p className="text-gray-300 mb-4">Get your tickets now for the rock concert of the year with amazing bands.</p>
                <Link 
                  to="/events" 
                  className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition duration-200"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white text-black text-center">
        <h2 className="text-3xl font-bold mb-4">Don’t Miss Out!</h2>
        <p className="mb-6">Sign up today and get early access to exclusive events and offers.</p>
        <Link 
          to="/register"
          className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition duration-200"
        >
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
