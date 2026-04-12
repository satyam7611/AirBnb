import Link from "next/link";
import React from "react";

export default function ListingCard({ listing }) {
  const imageUrl = listing?.image?.url || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
  
  return (
    <div className="group relative bg-white border-none mb-6 w-full max-w-[18rem] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative h-[20rem] overflow-hidden">
        <img
          src={imageUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={listing.title || "Listing Default"}
        />
        {/* Subtle white overlay on hover matching the old .card-img-overlay */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      
      <div className="py-3 px-1">
        <h5 className="font-bold text-gray-900 truncate text-lg">
          {listing.title}
        </h5>
        <div className="text-gray-700 mt-1">
          <span className="font-semibold text-black">
            ₹{listing.price?.toLocaleString("en-IN") || 0}
          </span>
          <span className="text-gray-500 text-sm"> /night</span>
          <i className="tax-info text-sm text-gray-500 italic ml-2 hidden">&nbsp;+ 18% GST</i>
        </div>

        {/* stretched-link equivalent in Tailwind: makes the whole card clickable */}
        <Link href={`/listings/${listing._id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View Details for {listing.title}</span>
        </Link>
      </div>
    </div>
  );
}
