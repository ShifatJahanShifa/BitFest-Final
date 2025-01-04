import React, { useState } from 'react';

const AskQuestion = () => {
  const [isRagInitialized, setIsRagInitialized] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInitializeRag = async () => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setError("No access token found.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/qna/initialize-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();  // Get error message from response body
        throw new Error(`Failed to initialize RAG system: ${errorData.detail || response.statusText}`);
      }

      const data = await response.json();
      setIsRagInitialized(true); // Mark RAG as initialized
      alert(data.message); // Display success message
    } catch (error) {
      console.error("Error initializing RAG system:", error);
      setError(`An error occurred: ${error.message}`); // Display detailed error message
    }
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setError("No access token found.");
      return;
    }

    setIsLoading(true);
    setResponse('');
    setError('');

    try {
      const url = new URL('http://localhost:8000/qna/ask-question');
      url.searchParams.append('question', question); // Append the question as query parameter

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.response || 'No response from backend');
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rag-and-ask-container mt-5 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Initialize RAG button */}
      {!isRagInitialized && (
        <div className="rag-init-container text-center mb-6">
          <button
            onClick={handleInitializeRag}
            className="bg-blue-500 text-white py-2 px-6 rounded-full shadow hover:bg-blue-600 focus:outline-none"
          >
            Initialize RAG
          </button>
        </div>
      )}

      {/* After RAG Initialization */}
      {isRagInitialized && (
        <div className="ask-question-container mt-4">
          <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
          
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question here"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow mt-4 hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
          >
            {isLoading ? 'Processing...' : 'Submit Question'}
          </button>

          {/* Response Box */}
          {response && (
            <div className="response mt-4 p-4 bg-gray-100 rounded-lg">
              <strong>Answer:</strong> <p>{response}</p>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="error-message mt-4 text-red-600">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
