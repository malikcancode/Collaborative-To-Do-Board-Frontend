// src/components/Loading.jsx
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
