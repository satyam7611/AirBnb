"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "../../lib/api";
import ListingCard from "../../components/ListingCard";

function ListingsContent() {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTax, setShowTax] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        let url = "/listings";
        if (search) {
          url += `?search=${encodeURIComponent(search)}`;
        }
        const response = await api.get(url);
        if (response.data && response.data.allListings) {
          setAllListings(response.data.allListings);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, [search]);

  // Tailwind equivalent of the tax toggle mechanic
  useEffect(() => {
    if (showTax) {
      document.body.classList.add("show-tax");
    } else {
      document.body.classList.remove("show-tax");
    }
  }, [showTax]);

  return (
    <>
      {/* Filters Bar */}
      <div className="flex items-center justify-between overflow-x-auto w-full pb-4 gap-8 mb-6 mt-4 no-scrollbar">
        <div className="flex gap-8 items-center shrink-0">
          {[
            { icon: "fa-fire", label: "Trending" },
            { icon: "fa-bed", label: "Rooms" },
            { icon: "fa-mountain-city", label: "Iconic cities" },
            { icon: "fa-mountain", label: "Mountain cities" },
            { icon: "fa-fort-awesome", label: "Castles" },
            { icon: "fa-snowflake", label: "Arctic" },
            { icon: "fa-tractor", label: "Farms" },
            { icon: "fa-campground", label: "Camping" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-center opacity-70 hover:opacity-100 hover:border-b-2 border-black pb-1 cursor-pointer transition-all min-w-[70px]">
              <i className={`fa-solid ${item.icon} text-2xl mb-2`}></i>
              <p className="text-sm font-medium whitespace-nowrap">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tax Toggle */}
        <div className="shrink-0 border border-gray-300 rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-md transition-shadow cursor-default bg-white ml-auto">
          <span className="font-medium text-sm">Display total after tax</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showTax}
              onChange={(e) => setShowTax(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-airbnb-red"></div>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb-red"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-2">
          {allListings.length > 0 ? (
            allListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 text-lg">
              No listings found matching your search criteria.
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb-red"></div>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  )
}
