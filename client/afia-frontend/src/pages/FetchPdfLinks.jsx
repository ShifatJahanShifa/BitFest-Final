import React, { useEffect, useState } from "react";

const FetchPdfLinksAndContent = () => {
  const [pdfContents, setPdfContents] = useState([]); // State to hold the PDF contents
  const [error, setError] = useState("");

  const fetchPdfLinks = async () => {
    const linksEndpoint = "http://localhost:8000/content/get-pdf-links/1"; // Replace with your actual endpoint

    try {
      const response = await fetch(linksEndpoint);
      if (response.ok) {
        const data = await response.json();
        console.log(`User ID: ${data.user_id}`);
        console.log("PDF Links:", data.pdf_links);
        fetchPdfContents(data.pdf_links); // Fetch content for each link
      } else if (response.status === 404) {
        setError("No PDFs found for this user.");
      } else {
        const errorDetail = await response.json();
        setError(`Error: ${response.status} - ${errorDetail.detail || "Unknown error"}`);
      }
    } catch (error) {
      setError(`Error while fetching PDF links: ${error.message}`);
    }
  };

  const fetchPdfContents = async (pdfLinks) => {
    const contentEndpointBase = "http://localhost:8000/content/get-pdf-content/?pdf_url=";

    try {
      const contents = [];
      for (const link of pdfLinks) {
        const response = await fetch(`${contentEndpointBase}${encodeURIComponent(link)}`);
        if (response.ok) {
          const data = await response.json();
          contents.push({ link, content: data.pdf_content });
        } else {
          const errorDetail = await response.json();
          console.error(`Error fetching content for ${link}: ${errorDetail.detail || "Unknown error"}`);
        }
      }
      setPdfContents(contents); // Update state with all fetched contents
    } catch (error) {
      setError(`Error while fetching PDF contents: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPdfLinks();
  }, []);

  return (
    <div>
      <h1>Fetching PDF Links and Contents</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {pdfContents.length > 0 ? (
        <div>
          <h2>PDF Contents:</h2>
          {pdfContents.map((pdf, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h3>PDF Link: {pdf.link}</h3>
              <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {pdf.content}
              </pre>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default FetchPdfLinksAndContent;
