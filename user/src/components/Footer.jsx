import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">
        
        {/* About Section */}
        <div className="md:w-1/3">
          <h3 className="text-2xl font-bold mb-3">MusicEvents</h3>
          <p className="text-gray-400">
            Discover, book, and enjoy the best music events near you. We make live music unforgettable.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:w-1/3">
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/events" className="hover:text-gray-200 transition-colors">Events</a></li>
            <li><a href="/about" className="hover:text-gray-200 transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-gray-200 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Social Media + Newsletter */}
        <div className="md:w-1/3">
          <h3 className="text-xl font-semibold mb-3">Follow & Subscribe</h3>
          <div className="flex space-x-4 mb-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
              <FaInstagram size={20} />
            </a>
          </div>
          <form className="flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="px-3 py-2 rounded-md text-gray-900 flex-1 focus:outline-none"
            />
            <button className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </form>
        </div>

      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MusicEvents. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
