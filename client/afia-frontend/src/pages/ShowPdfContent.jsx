import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ShowPdfContent = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);  // Parse the query string
  const contentLink = queryParams.get('contentLink');  // Get the contentLink parameter
  console.log('contentLink - ', contentLink);

  const [pdfContent, setPdfContent] = useState(null);  // State to hold the PDF content
  const [error, setError] = useState(null);  // State to hold error messages

  // Fetch PDF content when contentLink changes
  useEffect(() => {
    if (!contentLink) {
      setError('No content link provided.');
      return;
    }
    fetchPdfContents(contentLink);
  }, [contentLink]);

  // Function to fetch PDF content
  const fetchPdfContents = async (link) => {
    const contentEndpointBase = "http://localhost:8000/content/get-pdf-content/?pdf_url=";

    try {
      const response = await fetch(`${contentEndpointBase}${encodeURIComponent(link)}`);
      if (response.ok) {
        const data = await response.json();
        setPdfContent(data.pdf_content); // Update the state with the fetched PDF content
      } else {
        const errorDetail = await response.json();
        setError(`Error fetching content: ${errorDetail.detail || "Unknown error"}`);
      }
    } catch (error) {
      setError(`Error while fetching PDF content: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-6 px-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        {error && (
          <div className="bg-red-100 text-red-800 border border-red-300 rounded-md p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {pdfContent ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">PDF Content</h3>
            <div className="prose max-w-none">
              <p>{pdfContent}</p> {/* Assuming 'pdf_content' is text or HTML content */}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <span className="text-lg text-gray-600">Loading PDF content...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPdfContent;
