import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className=" h-screen w-screen flex flex-col items-center justify-center space-y-6 p-6 bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="animate-bounce p-4 bg-red-50 rounded-full">
            <AlertTriangle
              className="text-red-500"
              size={64}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! Something Went Wrong
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 font-medium text-sm">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Don't worry, our team has been notified. You can try refreshing the
          page or returning to the previous screen.
        </p>

        <div className="flex justify-center space-x-4">
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          )}

          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Go Home
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x"></div>
    </div>
  );
};

export default ErrorFallback;
