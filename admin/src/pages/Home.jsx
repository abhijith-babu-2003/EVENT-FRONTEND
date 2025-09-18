import React from "react";
import { FaUsers, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 min-h-screen p-6 space-y-6">
          <div className="h-12 bg-gray-700 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"></div>

          <div className="h-12 bg-gray-700 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"></div>

          <div className="h-12 bg-gray-700 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"></div>

          <div className="h-12 bg-gray-700 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"></div>
          <div className="h-12 bg-gray-700 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"></div>

          <div className="h-12 bg-gray-700 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"></div>

          <div className="h-12 bg-gray-700 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"></div>

          <div className="h-12 bg-gray-700 rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"></div>
        </aside>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Total Users */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
              <FaUsers size={30} className="text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-gray-500">1,234</p>
              </div>
            </div>

            {/* Card 2: Upcoming Events */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
              <FaCalendarAlt size={30} className="text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                <p className="text-gray-500">56</p>
              </div>
            </div>

            {/* Card 3: Tickets Sold */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
              <FaTicketAlt size={30} className="text-yellow-500" />
              <div>
                <h3 className="text-lg font-semibold">Tickets Sold</h3>
                <p className="text-gray-500">4,567</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
