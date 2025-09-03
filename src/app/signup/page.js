"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"; // update as needed

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Send OTP request to backend
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!form.name || !form.dob || !form.email) {
      setError("All fields are required.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          dob: form.dob,
          email: form.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP. Please try again.");
      } else {
        setInfo("OTP sent to your email.");
        setStep(2);
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  // Handle OTP verification and signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.otp) {
      setError("OTP is required.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Optionally save JWT in secure cookie or storage for auto-login
        setInfo("Signup successful! Redirecting to sign in...");
        setTimeout(() => router.push("/signin"), 1500);
      } else {
        setError(data.error || "Invalid OTP or signup failed.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setInfo("");
  };

  // Placeholder for Google signup
  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE_URL}/auth/google`; // Open backend Google OAuth route
  };

  return (
    <div className="min-h-screen text-gray-800 flex flex-col md:flex-row items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 md:w-1/2 w-full">
        <div className="flex items-center mb-8">
          <span className="text-2xl mr-2">🔆</span>
          <span className="font-semibold text-gray-600">HD</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Sign up</h1>
        <p className="mb-6 text-gray-500">Sign up to enjoy the feature of HD</p>
        {/* Error and info messages */}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {info && <div className="mb-4 text-green-600">{info}</div>}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOTP}>
            <div>
              <label className="block text-sm mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Get OTP
            </button>
            {/* Google signup option */}
            <div className="text-center my-2">
              <span className="text-xs text-gray-500">OR</span>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100"
            >
              <img src="https://imgs.search.brave.com/XUw-4vDMircK355cvrmedUbEUXjwLfWTLUWV7GeRKJ0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzNjLzE3/L2NjLzNjMTdjY2Iy/NWQxODZlMmRmYzc0/YWE3NjRkMzRkOTA3/LmpwZw" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                readOnly
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                readOnly
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />
            </div>
            <div className="relative">
              <label className="block text-sm mb-1">OTP</label>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded pr-10"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                {/* Add icon if needed */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Sign up
            </button>
          </form>
        )}
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
      <div className="hidden md:block md:w-1/2 ml-8 rounded-lg overflow-hidden">
        <Image
          src="/signup.avif"
          alt="Sign Up Illustration"
          width={500}
          height={500}
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
