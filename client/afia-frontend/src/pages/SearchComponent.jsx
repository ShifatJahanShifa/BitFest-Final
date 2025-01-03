import React, { useState } from "react";
import axios from "axios";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState(""); // State for filter option
  const [results, setResults] = useState([]);

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
        setResults(response.data.results); 
        console.log("Search results:", response.data.results);
        // Set the search results
      } else {
        setResults([]); // No results found
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="w-fit p-4 mx-auto">
      <form className="flex flex-row gap-3" onSubmit={handleSubmission}>
        <input
          type="text"
          placeholder="search for a PDF and user"
          className="bg-slate-100 p-2 border border-black rounded-lg"
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
          <option value="content">None</option>

        </select>
        <button type="submit" className="p-2 bg-black text-white rounded-lg">
          Search
        </button>
      </form>

      {/* Display results */}
      <div className="mt-4">
        {results.length > 0 ? (
          <ul>
            {results.map((content) => (
              <li key={content.id} className="mb-4">
                <h3 className="font-bold">{content.title}</h3>
                <p>{content.caption}</p>
                <a href={content.link} className="text-blue-500">
                  View Content
                </a>
                <p className="text-gray-500">By {content.user_name}</p>
                <p className="text-gray-400">
                  {new Date(content.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
