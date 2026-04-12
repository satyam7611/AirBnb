import React from "react";

export default function Flash({ type, message, onClose }) {
  if (!message) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <div
        className={`relative flex items-center justify-between p-4 rounded-lg shadow-sm border ${
          type === "error"
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-green-50 border-green-200 text-green-800"
        }`}
        role="alert"
      >
        <span className="font-medium">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className={`ml-4 inline-flex items-center justify-center w-8 h-8 rounded-lg focus:ring-2 focus:outline-none ${
            type === "error"
              ? "text-red-500 hover:bg-red-100 focus:ring-red-400"
              : "text-green-500 hover:bg-green-100 focus:ring-green-400"
          } transition-colors`}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
