import React from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaUsers, FaSignInAlt, FaUserPlus } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F3]">
      {/* Header */}
      <header className="w-full bg-[#1C352D] text-[#F9F6F3] px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
          Collab<span className="text-[#A6B28B]">Board</span>
        </h1>
        <nav className="flex gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A6B28B] text-[#1C352D] font-semibold hover:opacity-90 transition"
          >
            <FaSignInAlt /> Sign In
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#A6B28B] font-semibold hover:bg-[#A6B28B] hover:text-[#1C352D] transition"
          >
            <FaUserPlus /> Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between flex-1 px-8 sm:px-16 lg:px-24 py-12 gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C352D] leading-snug">
            Collaborative To-Do Board <br />
            with <span className="text-[#A6B28B]">Real-Time Updates</span>
          </h2>
          <p className="text-[#1C352D]/80 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0">
            Organize tasks, collaborate with your team, and stay updated
            instantly. Manage projects with ease using our real-time board.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-[#1C352D] text-[#F9F6F3] font-semibold shadow hover:bg-[#A6B28B] hover:text-[#1C352D] transition"
            >
              Get Started
            </Link>
            {/* <Link
              to="/boards"
              className="px-6 py-3 rounded-xl border-2 border-[#1C352D] text-[#1C352D] font-semibold hover:bg-[#1C352D] hover:text-[#F9F6F3] transition"
            >
              Explore Boards
            </Link> */}
          </div>
        </div>

        {/* Right Content - Icon Showcase */}
        <div className="flex-1 flex justify-center">
          <div className="grid grid-cols-2 gap-6 text-[#1C352D] text-6xl sm:text-7xl">
            <FaTasks className="p-4 bg-[#A6B28B]/30 rounded-2xl shadow" />
            <FaUsers className="p-4 bg-[#A6B28B]/30 rounded-2xl shadow" />
            <FaSignInAlt className="p-4 bg-[#A6B28B]/30 rounded-2xl shadow" />
            <FaUserPlus className="p-4 bg-[#A6B28B]/30 rounded-2xl shadow" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1C352D] text-[#F9F6F3] text-center py-4 text-sm">
        © {new Date().getFullYear()} CollabBoard. Built for teamwork ✨
      </footer>
    </div>
  );
}

export default Home;
