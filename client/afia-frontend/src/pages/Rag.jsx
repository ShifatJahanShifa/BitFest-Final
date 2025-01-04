import React from 'react'

const Rag = () => {

  const handleInitializeRag = async () => {
    const accessToken = localStorage.getItem("token");
    console.log("Access Token:", accessToken);
    if (!accessToken) {
      setError("No access token found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/qna/initialize-rag`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Response:", response);

      if (!response.ok) {
        const errorData = await response.json();  // Get error message from response body
        throw new Error(`Failed to initialize RAG system: ${errorData.detail || response.statusText}`);
      }

      const data = await response.json();
      console.log("RAG system initialized:", data);
      alert(data.message); // Display success message
    } catch (error) {
      console.error("Error initializing RAG system:", error);
      alert(`An error occurred: ${error.message}`); // Display detailed error message
    }
};

  return (
    <div>
      <button onClick={handleInitializeRag}>Initialize RAG</button>
    </div>
  )
}

export default Rag
