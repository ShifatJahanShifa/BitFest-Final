import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [userDetails, setUserDetails] = useState({
    name: "Rehnuma Priya",
    email: "lubainafiak@gmail.com",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage (or state)

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/user/all", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the headers
          },
        });
        setAllUsers(response.data); // Set all users
      } catch (error) {
        console.error("Error fetching all users:", error);
        setMessage("Failed to load users.");
      }
    };
    fetchAllUsers();
  }, [token]); // Depend on the token

  // Fetch user details from backend (mocked here)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Simulating a user details fetch from an API
        const response = await axios.get("http://127.0.0.1:8000/user/details", {
          params: { email: userDetails.email },
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the headers
          },
        });
        console.log("User details response:", response.data);
        setUserDetails(response.data); // Set user data
      } catch (error) {
        console.error("Error fetching user details:", error);
        setMessage("Failed to load user details.");
      }
    };
    fetchUserDetails();
  }, [userDetails.email, token]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/user/update/${userDetails.email}`,
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the headers
          },
        }
      );
      if (response.status === 200) {
        setMessage("User details updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      setMessage("Failed to update user details.");
    }
  };

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mt-5 w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Page - User Details</h1>

      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">User Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-black text-white py-3 px-5 rounded-full mr-2 flex items-center justify-center"
          >
            {isEditing ? "Cancel Edit" : "Edit Details"}
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={userDetails.name}
              name="name"
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={userDetails.email}
              name="email"
              disabled
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={userDetails.phone}
              name="phone"
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={userDetails.password}
              name="password"
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white py-2 px-6 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold">All Users</h2>
        <ul>
          {allUsers.map((user) => (
            <li key={user.email} className="mt-2">
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
