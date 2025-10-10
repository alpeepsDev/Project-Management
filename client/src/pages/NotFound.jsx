import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context";

const NotFound = () => {
  const { isDark } = useTheme();
  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-white"} flex items-center justify-center px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div
            className={`text-9xl font-bold ${isDark ? "text-gray-700" : "text-gray-200"} mb-4`}
          >
            404
          </div>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}
          >
            Page Not Found
          </h1>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} mb-6`}
          >
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/login"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Go to Home
          </Link>
        </div>

        {/* TaskForge Branding */}
        <div
          className={`mt-12 pt-8 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <h2
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-2`}
          >
            TaskForge
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Shape ideas into results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
