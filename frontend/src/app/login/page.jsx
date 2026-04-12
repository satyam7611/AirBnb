"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";
import Flash from "../../components/Flash";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      return; 
    }

    setIsSubmitting(true);
    const params = new URLSearchParams();
    params.append("username", form.username.value);
    params.append("password", form.password.value);

    try {
      const res = await api.post("/login", params);
      if (res.data?.success) {
        localStorage.setItem("currUser", JSON.stringify(res.data.user));
        window.location.href = res.data.redirectUrl || "/listings";
      } else {
        setError("Invalid username or password");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 mt-8">
      <div className="w-full max-w-md">
        <Flash type="error" message={error} onClose={() => setError(null)} />
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Log in to Wanderlust securely.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="peer w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red focus:bg-white transition-all shadow-sm"
              />
              <p className="mt-2 text-sm text-red-600 hidden peer-invalid:peer-[&:not(:placeholder-shown)]:block">
                Username is required.
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="peer w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red focus:bg-white transition-all shadow-sm"
              />
              <p className="mt-2 text-sm text-red-600 hidden peer-invalid:peer-[&:not(:placeholder-shown)]:block">
                Password is required.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2
                ${isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-airbnb-red hover:bg-red-600 hover:shadow-lg'}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-airbnb-red font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
