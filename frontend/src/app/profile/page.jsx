"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect if client-side check detects unauthenticated state (as backup to middleware)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb-red"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 overflow-hidden relative">
        {/* Background gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-airbnb-red to-airbnb-orange opacity-90"></div>

        {/* Profile Card Content */}
        <div className="relative pt-12 flex flex-col items-center">
          {/* Avatar Placeholder */}
          <div className="w-28 h-28 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center text-4xl font-bold text-airbnb-red mb-4">
            {user.username ? user.username[0].toUpperCase() : "U"}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.username}</h1>
          <p className="text-gray-500 mb-6">{user.email}</p>

          <div className="w-full border-t border-gray-100 pt-6 mt-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="block text-gray-400 font-medium mb-1">User ID</span>
                <span className="font-mono text-gray-800 select-all">{user._id}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="block text-gray-400 font-medium mb-1">Status</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Active Session
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4 w-full">
            <button
              onClick={() => router.push("/listings")}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all shadow-sm"
            >
              Explore Listings
            </button>
            <button
              onClick={logout}
              className="flex-1 py-3 px-4 bg-airbnb-red hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg shadow-airbnb-red/30"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
