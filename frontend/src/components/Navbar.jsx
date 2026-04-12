"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function Navbar() {
  const [currUser, setCurrUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("currUser");
    if (user) {
      setCurrUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await api.get("/logout");
      localStorage.removeItem("currUser");
      setCurrUser(null);
      window.location.href = "/listings"; // redirect to home
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/listings`);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 px-4 py-3">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link
          href="/listings"
          className="text-airbnb-red text-2xl hover:scale-110 hover:rotate-12 transition-transform duration-300"
        >
          <i className="fa-regular fa-compass"></i>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>

        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } w-full md:flex md:w-auto md:items-center flex-col md:flex-row mt-4 md:mt-0 gap-4 md:gap-6`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              href="/listings"
              className="text-gray-800 font-medium hover:text-airbnb-red transition-colors relative group"
            >
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-airbnb-red to-airbnb-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto mt-2 md:mt-0 relative group">
            <input
              type="search"
              placeholder="Search destinations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red transition-all"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <button
              type="submit"
              className="hidden md:block absolute right-1 top-1/2 -translate-y-1/2 bg-airbnb-red text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mt-2 md:mt-0">
            <Link
              href="/listings/new"
              className="text-gray-800 font-medium hover:text-airbnb-red transition-colors"
            >
              Airbnb Your Home
            </Link>

            {!currUser ? (
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Link
                  href="/signup"
                  className="px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 rounded-full transition-colors"
                >
                  Signup
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-gradient-to-r from-airbnb-red to-airbnb-orange text-white font-semibold rounded-full hover:-translate-y-0.5 hover:shadow-lg shadow-airbnb-red/40 transition-all"
                >
                  Login
                </Link>
              </div>
            ) : (
              <a
                href="#"
                onClick={handleLogout}
                className="text-airbnb-red font-medium hover:underline mt-2 md:mt-0"
              >
                Logout
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
