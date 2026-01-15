import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[180px] font-black text-gray-200 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500 text-sm">
            It might have been moved or deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">What you can do:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Check the URL for typos</li>
                <li>Go back to the previous page</li>
                <li>Return to the homepage or dashboard</li>
                <li>Use the navigation menu to find what you need</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </button>
        </div>

        {/* Additional Help */}
        <p className="mt-8 text-sm text-gray-500">
          Need help?{' '}
          <a
            href="/support"
            className="text-pink-500 hover:text-pink-600 font-medium underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
