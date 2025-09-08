import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden md:flex w-1/2 bg-[#A6B28B] items-center justify-center">
        <img
          src="https://via.placeholder.com/500x500"
          alt="Login Illustration"
          className="max-w-md rounded-xl shadow-lg"
        />
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#F9F6F3] px-6 py-12">
        <h2 className="text-3xl font-bold text-[#1C352D] mb-6">Sign In</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 text-[#1C352D]"
        >
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
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-[#1C352D]">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#1C352D] font-semibold underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
