import React, { useState } from "react";

const Card = ({ id, value, label, publicStatus, onStatusChange }) => {
  const [status, setStatus] = useState(publicStatus); // Initialize with the current public/private status

  // Handle change in dropdown
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value === "public"; // Convert the string to boolean

    setStatus(newStatus); // Update local state
    console.log(`Status changed to: ${newStatus}`);
    // Trigger onStatusChange callback to notify the parent component (Dashboard)
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  return (
    <div className="card">
      <h3>{value}</h3>
      <p>{label}</p>

      {/* Dropdown to select public or private */}
      <select
        value={status ? "public" : "private"}
        onChange={handleStatusChange}
        className="status-dropdown"
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </div>
  );
};

export default Card;
