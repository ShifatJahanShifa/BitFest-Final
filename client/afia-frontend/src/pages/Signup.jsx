import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role is 'student'
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const navigate = useNavigate(); // To navigate to the home page after success
  const [signup, setSignup] = useState("");

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
        formData, // Send formData as a JSON object
        {
          headers: { "Content-Type": "application/json" }, // Ensure the correct content type
        }
      );
  
      console.log("response", response);
  
      if (response.status === 200) {
        setIsSuccess(true);
        setSignup("Registration successful! Redirecting...");
        setFormData({ name: "", email: "", password: "", role: "user" });
  
        const { access_token } = response.data;
        localStorage.setItem("token", access_token);
  
        const decodedToken = JSON.parse(atob(access_token.split(".")[1]));
        console.log("Decoded Token:", decodedToken);
        const { user_id, role } = decodedToken;
  
        console.log("User ID:", user_id);
        console.log("Role:", role);
  
        setShowPopup(true);
  
        setTimeout(() => {
          setShowPopup(false);
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
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
        {message && (
          <p
          className={`text-center mb-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
        { !isSuccess && <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Sign Up</h2>
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
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>

        </form>}
        { isSuccess && 
          <div>
            <h3 className="text-center top-48 left-40">
              { signup}
            </h3>
          </div>
        }
        
      </div>
    </div>
  );
};

export default Signup;
