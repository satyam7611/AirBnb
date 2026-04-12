"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import Flash from "../../../components/Flash";

export default function NewListingPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currUser = localStorage.getItem("currUser");
    if (!currUser) {
      setError("Please log in to create a new listing!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    const form = e.target;
    
    if (!form.checkValidity()) {
      return; // Native HTML5 validation will show tooltips or peer will catch it
    }

    setIsSubmitting(true);
    const formData = new FormData(form);

    try {
      const res = await api.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        router.push(res.data.redirectUrl || "/listings");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create listing");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 md:mt-16 px-4">
      <Flash type="error" message={error} onClose={() => setError(null)} />
      
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Create a New Listing</h2>
        
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title Group */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              name="listing[title]"
              type="text"
              placeholder="e.g. Modern Villa by the Beach"
              required
              className="peer w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red focus:bg-white transition-all shadow-sm"
            />
            <p className="mt-2 text-sm text-red-600 hidden peer-invalid:peer-[&:not(:placeholder-shown)]:block">
              Title is required.
            </p>
          </div>

          {/* Description Group */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="listing[description]"
              rows="4"
              placeholder="Describe your place..."
              required
              className="peer w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red focus:bg-white transition-all shadow-sm resize-none"
            ></textarea>
            <p className="mt-2 text-sm text-red-600 hidden peer-invalid:peer-[&:not(:placeholder-shown)]:block">
              Please add a short description.
            </p>
          </div>

          {/* Image Group */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Listing Image
            </label>
            <input
              id="image"
              name="listing[image]"
              type="file"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-airbnb-red/10 file:text-airbnb-red hover:file:bg-airbnb-red/20 transition-all cursor-pointer"
            />
          </div>

          {/* Price & Country Row */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 w-full">
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  id="price"
                  name="listing[price]"
                  type="number"
                  placeholder="1200"
                  required
                  min="0"
                  className="peer w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red focus:bg-white transition-all shadow-sm"
                />
              </div>
              <p className="mt-2 text-sm text-red-600 hidden peer-invalid:peer-[&:not(:placeholder-shown)]:block">
                Valid price required.
              </p>
            </div>
            
            <div className="md:w-2/3 w-full">
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <input
                id="country"
                name="listing[country]"
                type="text"
                placeholder="India"
                required
                className="peer w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red focus:bg-white transition-all shadow-sm"
              />
              <p className="mt-2 text-sm text-red-600 hidden peer-invalid:peer-[&:not(:placeholder-shown)]:block">
                Country is required.
              </p>
            </div>
          </div>

          {/* Location Group */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <i className="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                id="location"
                name="listing[location]"
                type="text"
                placeholder="Jaipur, Rajasthan"
                required
                className="peer w-full pl-9 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red focus:bg-white transition-all shadow-sm"
              />
            </div>
            <p className="mt-2 text-sm text-red-600 hidden peer-invalid:peer-[&:not(:placeholder-shown)]:block">
              Location is required.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2
                ${isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-airbnb-red hover:bg-red-600 hover:shadow-lg'}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
