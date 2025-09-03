/* eslint-disable @next/next/no-img-element */
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api" // update as needed

export default function SignIn() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    otp: "",
    remember: false,
  })
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  // Send OTP to user's email (backend)
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")
    if (!form.email) {
      setError("Email is required.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      })
      const data = await res.json()
      if (res.ok) {
        setOtpSent(true)
        setInfo("OTP sent to your email.")
      } else {
        setError(data.error || "Failed to send OTP.")
      }
    } catch {
      setError("Could not connect to server.")
    }
    setLoading(false)
  }

  // Resend OTP (same as above)
  const handleResendOTP = (e) => {
    e.preventDefault()
    handleSendOTP(e)
  }

  // Handle OTP Verify/Login
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")
    if (!form.email || !form.otp) {
      setError("Email and OTP are required.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp })
      })
      const data = await res.json()
      if (res.ok) {
        // Optionally: store JWT/token from data.token in cookie/localstorage for authenticated requests
        setInfo("Sign in successful! Redirecting...")
        setTimeout(() => router.push("/"), 1200)
      } else {
        setError(data.error || "Invalid OTP or sign in failed.")
      }
    } catch {
      setError("Could not connect to server.")
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    setError("") // clear errors on input
    setInfo("")
  }

  // For Google sign-in button (redirect to backend OAuth flow)
  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/auth/google`
  }

  return (
    <div className="min-h-screen text-gray-900 flex flex-col md:flex-row items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 md:w-1/2 w-full">
        <div className="flex items-center mb-8">
          <span className="text-2xl mr-2">🔆</span>
          <span className="font-semibold text-gray-600">HD</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
        <p className="mb-6 text-gray-500">Please login to continue to your account.</p>
        {/* Error and info messages */}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {info && <div className="mb-4 text-green-600">{info}</div>}
        <form className="space-y-4" onSubmit={otpSent ? handleSubmit : handleSendOTP}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
              disabled={otpSent}
            />
          </div>
          {otpSent && (
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
                {/* Add eye/hide icon as needed */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            {otpSent && (
              <a
                href="#"
                className="text-blue-500 text-sm hover:underline"
                onClick={handleResendOTP}
              >
                Resend OTP
              </a>
            )}
            <label className="flex items-center text-sm select-none">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="mr-2"
              />
              Keep me logged in
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {otpSent ? "Sign in" : "Get OTP"}
          </button>
          <div className="text-center my-2">
            <span className="text-xs text-gray-500">OR</span>
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100"
          >
            <img src="https://imgs.search.brave.com/5dRuBOedlVFn8yCv2UHpQiDQ5CZoQUDGb1h6x3FfpTA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzg4LzA3Lzg0/LzM2MF9GXzM4ODA3/ODQ1NF9tS3RiZFhZ/RjljeVFvdkNDVHNq/cUkwZ2JmdTdnQ2NT/cC5qcGc" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Need an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Create one
          </a>
        </p>
      </div>
      <div className="hidden md:block md:w-1/2 ml-8 rounded-lg overflow-hidden">
        <Image
          src="/signin.avif"
          alt="Sign In Illustration"
          width={500}
          height={500}
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  )
}
