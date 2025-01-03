import React, { useEffect, useState } from 'react';

const ShowPubPost = () => {
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Initialize userId state

  useEffect(() => {
    // Fetch the public content
    const fetchPublicContents = async () => {
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        setError("No access token found.");
        return;
      }

      try {
        // Decode the JWT token to extract the user ID
        const decodedPayload = JSON.parse(atob(accessToken.split(".")[1]));
        const { user_id } = decodedPayload; // Extract user_id from the decoded token
        setUserId(user_id); // Set userId state

        const response = await fetch(
          `http://localhost:8000/content/get-public-contents/${user_id}`, // Use user_id here
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch public contents");
        }

        const data = await response.json();
        console.log("data - ", data);

        if (data.contents && data.contents.length > 0) {
          // Trim title and caption
          const formattedContents = data.contents.map((content) => ({
            ...content,
            title: content.title.replace(/^শিরোনাম:\s*/, ''), // Trim "শিরোনাম: "
            caption: content.caption.replace(/^ক্যাপশন:\s*/, ''), // Trim "ক্যাপশন: "
          }));
          setContents(formattedContents); // Update the state with formatted contents
        } else {
          setError("No public contents found.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPublicContents();
  }, []); // Empty dependency array, this will run only once when the component mounts

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.length > 0 ? (
          contents.map((content) => (
            <div key={content.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-80">
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{content.title}</h3>
                <p className="text-gray-600 text-base mb-4">{content.caption}</p>
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
          <p className="text-center text-gray-500">No public contents to display.</p>
        )}
      </div>
    </div>
  );
};

export default ShowPubPost;
