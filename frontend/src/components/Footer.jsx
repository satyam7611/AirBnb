"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-8 flex flex-col items-center justify-center mt-auto border-t border-gray-200">
      <div className="flex gap-6 text-2xl text-gray-700 mb-4">
        <i className="fa-brands fa-square-facebook hover:text-blue-600 cursor-pointer transition-colors"></i>
        <i className="fa-brands fa-square-instagram hover:text-pink-600 cursor-pointer transition-colors"></i>
        <i className="fa-brands fa-linkedin hover:text-blue-700 cursor-pointer transition-colors"></i>
      </div>
      <div className="text-gray-600 font-medium mb-3">
        &copy; WanderLust Private Limited
      </div>
      <div className="flex gap-4 text-gray-500 text-sm">
        <a href="/privacy" className="hover:text-gray-900 hover:underline transition-colors">Privacy</a>
        <span className="text-gray-300">|</span>
        <a href="/terms" className="hover:text-gray-900 hover:underline transition-colors">Terms</a>
      </div>
    </footer>
  );
}
