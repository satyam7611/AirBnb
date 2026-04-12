"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../lib/api";
import Flash from "../../../../components/Flash";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await api.get(`/listings/${params.id}/edit`);
        if (res.data.listing) {
          setListing(res.data.listing);
          setOriginalImageUrl(res.data.originalImageUrl);
        }
      } catch (err) {
        setError("Failed to load listing details");
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    if (!form.checkValidity()) {
      return; 
    }

    setIsSubmitting(true);
    const formData = new FormData(form);

    try {
      const res = await api.put(`/listings/${params.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        router.push(res.data.redirectUrl || `/listings/${params.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update listing");
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb-red"></div>
    </div>
  );

  if (!listing) return <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-5 max-w-2xl mx-auto">Listing not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 md:mt-16 px-4">
      <Flash type="error" message={error} onClose={() => setError(null)} />
      
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Edit Listing</h2>
        
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
              defaultValue={listing.title}
              type="text"
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
              defaultValue={listing.description}
              rows="4"
              required
              className="peer w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red focus:bg-white transition-all shadow-sm resize-none"
            ></textarea>
            <p className="mt-2 text-sm text-red-600 hidden peer-invalid:peer-[&:not(:placeholder-shown)]:block">
              Please add a short description.
            </p>
          </div>

          {/* Current Image Preview */}
          {originalImageUrl && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Current Image Preview</label>
              <img
                src={originalImageUrl}
                alt="Listing preview"
                className="w-1/3 md:w-1/4 h-32 object-cover rounded-lg shadow-sm border border-gray-300"
              />
            </div>
          )}

          {/* Image Upload Group */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
              Upload New Image (Optional)
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
                  defaultValue={listing.price}
                  type="number"
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
                defaultValue={listing.country}
                type="text"
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
                defaultValue={listing.location}
                type="text"
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
              className={`w-full md:w-auto px-10 py-3.5 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2
                ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:shadow-lg'}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Save Changes'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
