import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#F9F6F3] px-6 py-12">
        <h2 className="text-3xl font-bold text-[#1C352D] mb-6">
          Create Account
        </h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 text-[#1C352D]"
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#A6B28B] focus:outline-none focus:ring-2 focus:ring-[#1C352D]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#A6B28B] focus:outline-none focus:ring-2 focus:ring-[#1C352D]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#A6B28B] focus:outline-none focus:ring-2 focus:ring-[#1C352D]"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#1C352D] text-[#F9F6F3] rounded-lg font-semibold hover:bg-[#A6B28B] hover:text-[#1C352D] transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-[#1C352D]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1C352D] font-semibold underline">
            Login
          </Link>
        </p>
      </div>

      {/* Right - Image */}
      <div className="hidden md:flex w-1/2 bg-[#A6B28B] items-center justify-center">
        <img
          src="https://via.placeholder.com/500x500"
          alt="Register Illustration"
          className="max-w-md rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}

export default Register;
