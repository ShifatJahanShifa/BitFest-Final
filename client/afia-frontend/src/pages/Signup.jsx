import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Default role is 'student'
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const navigate = useNavigate(); // To navigate to the home page after success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register",
        new URLSearchParams(formData), // Convert `formData` to `x-www-form-urlencoded`
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("response", response);
      
      if (response.status === 200) {
        setIsSuccess(true);
        setMessage("Registration successful! Redirecting...");
        setFormData({ name: "", email: "", password: "", role: "student" });

        // Store JWT token in localStorage
        const { access_token } = response.data;
        localStorage.setItem("token", access_token);

        // Decode JWT token to retrieve user ID and role
        const decodedToken = JSON.parse(atob(access_token.split(".")[1])); // Decode JWT token
        console.log("Decoded Token:", decodedToken);
        const { user_id, role } = decodedToken;

        // Print user ID and role to console
        console.log("User ID:", user_id);
        console.log("Role:", role);

        // Show success popup
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false); // Hide the popup after 2 seconds
          navigate("/"); // Navigate to home after successful signup
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 400 || error.response?.data?.message === "Email already exists.") {
        setMessage("An account with this email already exists.");
      } else {
        setMessage(error.response?.data?.message || "An error occurred. Please try again.");
      }
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Sign Up</h2>
        {message && (
          <p
            className={`text-center mb-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
