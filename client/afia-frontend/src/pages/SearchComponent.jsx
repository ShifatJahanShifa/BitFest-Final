import React, { useState } from "react";
import axios from "axios";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState(""); // State for filter option
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmission = async (e) => {
    e.preventDefault();

    try {
      // Make the GET request to the backend API
      const response = await axios.get("http://localhost:8000/content/search/", {
        params: {
          search_query: searchQuery,
          filter_by: filterBy,
        },
      });

      if (response.data.results) {
        // Format the content if needed
        const formattedResults = response.data.results.map((content) => ({
          ...content,
          title: content.title.replace(/^শিরোনাম:\s*/, ""), // Trim "শিরোনাম: "
          caption: content.caption.replace(/^ক্যাপশন:\s*/, ""), // Trim "ক্যাপশন: "
        }));

        setResults(formattedResults); // Set the search results
        setError(null); // Clear error message
      } else {
        setResults([]);
        setError("No matching results found.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("An error occurred while fetching search results.");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-5">
      <form className="flex flex-row gap-3 mb-6" onSubmit={handleSubmission}>
        <input
          type="text"
          placeholder="Search for a PDF or user"
          className="bg-slate-100 p-2 border border-black rounded-lg flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="bg-slate-100 p-2 border border-black rounded-lg"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)} // Update filter option
        >
          <option value="">Filter by</option>
          <option value="user">User</option>
          <option value="content">Content</option>
        </select>
        <button type="submit" className="p-2 bg-black text-white rounded-lg">
          Search
        </button>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Display results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length > 0 ? (
          results.map((content) => (
            <div key={content.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-80">
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{content.title}</h3>
                <p className="text-gray-600 text-base mb-4">{content.caption}</p>
                <p className="text-gray-500 text-center mt-2">
                By {content.user_name} on{" "}
                {new Date(content.created_at).toLocaleDateString()}
              </p>
              </div>
              {content.link && (
                <a
                  href={`/showcontents?contentLink=${encodeURIComponent(content.link)}`}
                  className="bg-black text-white py-2 px-4 rounded-b-md hover:bg-slate-700 transition block text-center"
                >
                  View PDF
                </a>
              )}
              
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500"></p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
