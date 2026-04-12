"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../lib/api";
import Flash from "../../../components/Flash";

// 🌟 Modern Tailwind SVG Interactive Star Rating
function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <button
            type="button"
            key={index}
            className={`w-8 h-8 transition-colors ${
              index <= (hover || rating) ? "text-airbnb-orange" : "text-gray-300"
            }`}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// 🌟 Read-only Static Stars for Reviews
function StaticStars({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${index <= rating ? "text-airbnb-orange" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      ))}
    </div>
  );
}

export default function ShowListingPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("currUser");
    if (user) {
      setCurrUser(JSON.parse(user));
    }
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${params.id}`);
      if (res.data.listing) {
        setListing(res.data.listing);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/listings/${params.id}`);
      if (res.data.success) {
        router.push("/listings");
      }
    } catch (err) {
      setError("Failed to delete listing.");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const paramsConfig = new URLSearchParams();
    paramsConfig.append("review[rating]", rating.toString());
    paramsConfig.append("review[comment]", comment);

    try {
      await api.post(`/listings/${params.id}/reviews`, paramsConfig);
      setRating(5);
      setComment("");
      fetchListing(); // Refresh reviews
    } catch (err) {
      setError("Failed to post review");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/listings/${params.id}/reviews/${reviewId}`);
      fetchListing();
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb-red"></div>
    </div>
  );
  if (!listing) return <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-5 max-w-2xl mx-auto">Listing not found.</div>;

  const isOwner = currUser && listing.owner && listing.owner._id === currUser._id;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      <Flash type="error" message={error} onClose={() => setError(null)} />
      
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{listing.title}</h2>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8 border border-gray-100">
        <div className="w-full h-[400px]">
          <img
            src={listing.image?.url}
            className="w-full h-full object-cover"
            alt={listing.title}
          />
        </div>
        
        <div className="p-6 md:p-8">
          <p className="text-gray-500 mb-4 text-sm font-medium">
            Owned by <span className="text-gray-900">{listing.owner ? listing.owner.username : "Admin"}</span>
          </p>
          <p className="text-gray-800 text-lg mb-6 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{listing.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
              <i className="fa-solid fa-indian-rupee-sign text-airbnb-red text-xl"></i>
              <span className="font-semibold text-lg">₹{listing.price?.toLocaleString("en-IN")} / night</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <i className="fa-solid fa-location-dot text-gray-500 text-xl"></i>
              <span className="font-medium text-lg">{listing.location}, {listing.country}</span>
            </div>
          </div>

          {isOwner && (
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => router.push(`/listings/${listing._id}/edit`)}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md"
              >
                Edit Listing
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-airbnb-red text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-md"
              >
                Delete Listing
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-8 mb-12">
        {currUser && (
          <div className="mb-10 bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Leave a Review</h4>
            <form onSubmit={submitReview} className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <StarRating rating={rating} setRating={setRating} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="comment">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-airbnb-red/50 focus:border-airbnb-red transition-all shadow-sm resize-none peer"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
                <p className="mt-2 text-sm text-red-600 hidden peer-invalid:block">Please add a comment</p>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-airbnb-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg w-full md:w-auto"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        <h4 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Guest Reviews</h4>
        
        {(!listing.reviews || listing.reviews.length === 0) ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to leave one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listing.reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h6 className="font-bold text-gray-900">@{review.author.username}</h6>
                  <StaticStars rating={review.rating} />
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                
                {currUser && review.author && review.author._id === currUser._id && (
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="text-sm font-medium text-gray-500 hover:text-airbnb-red transition-colors border border-gray-300 hover:border-airbnb-red px-3 py-1 rounded-md"
                  >
                    Delete Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
