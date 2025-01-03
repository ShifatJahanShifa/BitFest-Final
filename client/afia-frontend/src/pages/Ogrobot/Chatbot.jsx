import React, { useState } from "react";

const Chatbot = () => {
  const [formData, setFormData] = useState({
    craving: "",
    cuisine_type: "",
    taste: "",
    preparation_time: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // Store conversation history

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Save current form data to history
    const currentQuery = {
      craving: formData.craving,
      cuisine_type: formData.cuisine_type,
      taste: formData.taste,
      preparation_time: formData.preparation_time,
      response: "Loading...",
    };

    // Add the current query to the history
    setHistory((prevHistory) => [...prevHistory, currentQuery]);

    try {
      const res = await fetch("http://localhost:8000/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setResponse(data.recipe);
        // Update the latest history item with the response
        setHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1].response = data.recipe;
          return updatedHistory;
        });
      } else {
        setResponse(data.detail || "Something went wrong.");
        setHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1].response = data.detail || "Something went wrong.";
          return updatedHistory;
        });
      }
    } catch (error) {
      setResponse("Error: Unable to fetch the recipe.");
      setHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1].response = "Error: Unable to fetch the recipe.";
        return updatedHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800 text-center">
          Recipe Chatbot
        </h1>

        {/* Conversation History */}
        <div className="overflow-y-auto h-60 mb-4">
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-md mt-2">
                <div className="font-medium text-gray-700">Craving: {item.craving}</div>
                <div className="font-medium text-gray-700">Cuisine Type: {item.cuisine_type}</div>
                <div className="font-medium text-gray-700">Taste: {item.taste}</div>
                <div className="font-medium text-gray-700">Preparation Time: {item.preparation_time}</div>
                <div className="mt-2 text-gray-600">Response: {item.response}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="craving"
              className="block text-sm font-medium text-gray-700"
            >
              Craving:
            </label>
            <input
              type="text"
              id="craving"
              name="craving"
              value={formData.craving}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What are you craving?"
            />
          </div>

          <div>
            <label
              htmlFor="cuisine_type"
              className="block text-sm font-medium text-gray-700"
            >
              Cuisine Type:
            </label>
            <input
              type="text"
              id="cuisine_type"
              name="cuisine_type"
              value={formData.cuisine_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Italian, Indian, Chinese"
            />
          </div>

          <div>
            <label
              htmlFor="taste"
              className="block text-sm font-medium text-gray-700"
            >
              Taste:
            </label>
            <input
              type="text"
              id="taste"
              name="taste"
              value={formData.taste}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Spicy, Sweet, Savory"
            />
          </div>

          <div>
            <label
              htmlFor="preparation_time"
              className="block text-sm font-medium text-gray-700"
            >
              Preparation Time:
            </label>
            <input
              type="text"
              id="preparation_time"
              name="preparation_time"
              value={formData.preparation_time}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 30 minutes"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Fetching Recipe..." : "Generate Recipe"}
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default Chatbot;
