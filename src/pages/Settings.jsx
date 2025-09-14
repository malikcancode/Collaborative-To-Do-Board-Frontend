import React from "react";
import Navbar from "../components/Navbar";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

function Settings() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar /> {/* Navbar on top */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
          <h2 className="text-lg font-bold mb-6">Settings</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
              <FaUser /> Profile
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
              <FaLock /> Security
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
              <FaEnvelope /> Notifications
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-800">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Profile Settings
          </h1>

          <div className="bg-gray-300 p-6 rounded-xl shadow">
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
