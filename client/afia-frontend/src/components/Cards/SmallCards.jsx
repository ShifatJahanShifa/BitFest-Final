
import React, { useState } from "react";


const SmallCards = ({ id, value, label, publicStatus, onStatusChange }) => {
  const [status, setStatus] = useState(publicStatus); // Initialize with the current public/private status

  const handleStatusChange = (event) => {
    const newStatus = event.target.value === "public"; // Convert the string to boolean
    setStatus(newStatus);

    // Trigger onStatusChange callback to notify the parent component (Dashboard)
    if (onStatusChange) {
      onStatusChange(id, newStatus); // Pass the content ID and new status
    }
  };

  return (
    <a className="transform hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white mb-2">
      <div className="p-5 relative mb-2">
        {/* Dropdown box in the top right */}
        <div className="absolute top-2 right-2">
          <select
            value={status ? "public" : "private"}
            onChange={handleStatusChange}
            className="status-dropdown text-black bg-white border border-gray-300 rounded-md p-1"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="ml-2 w-full flex-1">
          <div>
            <div className="mt-7 font-bold leading-8 text-lg text-black ">{value}</div>
            <div className="mt-1 text-base text-gray-600">{label}</div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default SmallCards;