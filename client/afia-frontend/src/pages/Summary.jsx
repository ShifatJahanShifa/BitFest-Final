import React, { useState } from "react";
import axios from "axios";

const Summary = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload a file");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token not found.");
      }

      const response = await axios.post(
        "http://localhost:8000/summary/generate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization
          },
        }
      );

      const rawSummary = response.data.summary;

      // Clean the raw summary text (remove the code markers and extra newlines)
      const cleanedSummaryText = rawSummary.replace(/```json/g, "").replace(/```/g, "").trim();

      // Parse the cleaned text into a JSON object
      const parsedSummary = JSON.parse(cleanedSummaryText);

      if (parsedSummary && parsedSummary.content && parsedSummary.summary) {
        setSummary(parsedSummary); // Set the summary state
      } else {
        setError("Unexpected response format. Please contact support.");
      }
    } catch (err) {
      console.error("Error during summary generation:", err);
      setError("Error generating summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!summary) {
      setSaveError("No summary available to save.");
      return;
    }
    setSaveLoading(true);
    setSaveError(null);
    setSaveMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Token not found.");
      }

      const response = await axios.post(
        "http://localhost:8000/summary/save",
        summary,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization
          },
        }
      );

      if (response.data.message === "Summary saved successfully") {
        setSaveMessage("Summary saved successfully!");
      } else {
        setSaveError("Failed to save summary.");
      }
    } catch (err) {
      console.error("Error saving summary:", err);
      setSaveError("Error saving summary. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Summarize Your Content</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload a File (PDF/Text)</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.txt"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Summary"}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">
          <p>{error}</p>
        </div>
      )}

      {summary && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Summary</h3>
          <div className="text-sm text-gray-700">
            <p className="font-medium">Content:</p>
            <p>{summary.content}</p>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            <p className="font-medium">Summary:</p>
            <p>{summary.summary}</p>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-green-300"
            disabled={saveLoading}
          >
            {saveLoading ? "Saving..." : "Save Summary"}
          </button>

          {saveMessage && (
            <div className="mt-4 text-green-500 text-sm text-center">
              <p>{saveMessage}</p>
            </div>
          )}

          {saveError && (
            <div className="mt-4 text-red-500 text-sm text-center">
              <p>{saveError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Summary;
