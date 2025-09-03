'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignIn() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    otp: '',
    remember: false
  })

  // Simulate API for OTP resend/signin
  const handleResendOTP = (e) => {
    e.preventDefault()
    // TODO: send OTP to email API here
    alert('OTP resent!')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev =>
      ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      })
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: verify OTP and sign in (call backend)
    router.push('/') // On success, adjust to your home/dashboard
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
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="text-blue-500 text-sm hover:underline"
              onClick={handleResendOTP}
            >
              Resend OTP
            </a>
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
          >
            Sign in
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Need an account?{' '}
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
