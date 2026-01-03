import React from "react";
import { Link } from "react-router-dom"; // remove if you don't use react-router
import { assets } from "../assets/assets";

const NotFound = () => {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img
            src={assets.logo}
            alt="MAYILÉ"
            className="w-32 h-auto object-contain"
            aria-hidden={false}
          />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-semibold text-[#0b0b0b] mb-4">
          Page not found
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          We couldn't find the page you're looking for. It may have been moved,
          renamed, or does not exist. Explore our latest collections or get in
          touch and we'll help you find what you need.
        </p>

        {/* Decorative accent
        <div
          className="mx-auto mb-8 rounded-full w-24 h-1"
          style={{
            background:
              "linear-gradient(90deg, #8FABD4 0%, #4A70A9 60%)",
          }}
          aria-hidden="true"
        /> */}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Home button */}
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] shadow-md hover:opacity-95 transition"
            aria-label="Return to homepage"
          >
            Go to Homepage
          </Link>

          {/* Contact / Support */}
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition text-[#414141]"
            aria-label="Contact support"
          >
            Contact Support
          </Link>
        </div>

        {/* Small helpful links
        <div className="mt-8 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop" className="hover:underline">
            Browse Shop
          </Link>
          <span aria-hidden="true">•</span>
          <Link to="/collections" className="hover:underline">
            Collections
          </Link>
          <span aria-hidden="true">•</span>
          <Link to="/about" className="hover:underline">
            About Us
          </Link>
        </div> */}

        {/* Optional small footer copy */}
        <p className="mt-8 text-xs text-gray-400">
          If you think this is an error, please mention the URL when you
          contact us.
        </p>
      </div>
    </main>
  );
};

export default NotFound;
