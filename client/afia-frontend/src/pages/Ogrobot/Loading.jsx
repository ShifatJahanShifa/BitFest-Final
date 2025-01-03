import React from "react";

const Loading = ({ isLoading }) => {
  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center mt-2">
          {/* Custom Tailwind spinner */}
          <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-blue-800 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Loading;
