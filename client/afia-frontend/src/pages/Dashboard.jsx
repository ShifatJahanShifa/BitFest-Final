import React, { useEffect, useState } from 'react';
import Chart from '../components/Charts/RadialChart';
import Card from '../components/Cards/SmallCards';

const pdfs = [
  {id: 1, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 1", caption: "This is a dummy PDF file", public: true},
  {id: 2, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 2", caption: "This is a dummy PDF file", public: true},
  {id: 3, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 3", caption: "This is a dummy PDF file", public: false },
  {id: 4, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 4", caption: "This is a dummy PDF file", public: true},
];

const Dashboard = () => {
  const [userId, setUserId] = useState(null); // Declare state for user ID
  const [contents, setContents] = useState([]); // State to store fetched contents
  const [error, setError] = useState(""); // State to store error messages
  const [title, setTitle] = useState(""); // State to store title
  const [caption, setCaption] = useState(""); 

  // State to store caption
  // Function to fetch user contents
  const fetchUserContents = async () => {
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

      // Fetch the contents of the user
      const response = await fetch(`http://localhost:8000/content/get-contents`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("response", response);

      if (response.ok) {
        const data = await response.json();
        const trimmedContents = data.contents.map(content => ({
          ...content,
          title: content.title.replace(/^শিরোনাম:\s*/, ''), // Trim "শিরোনাম: "
          caption: content.caption.replace(/^ক্যাপশন:\s*/, ''), // Trim "ক্যাপশন: "
        }));
        setContents(trimmedContents); // Store trimmed contents in the state
      } else {
        const errorDetail = await response.json();
        setError(errorDetail.detail || "Failed to fetch contents.");
      }
    } catch (error) {
      setError(`Error fetching user contents: ${error.message}`);
    }
  };

  const chartOptions = {
    series: [44, 55, 67, 83],
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              return 249;
            },
          },
        },
      },
    },
    labels: ['words-translated', 'stories-written', 'bot interactions', 'stories-read'],
  };


  
  // Function to handle the status change
  const handleStatusChange = async (contentId, newStatus) => {
  const accessToken = localStorage.getItem("token");

  if (!accessToken) {
    setError("No access token found.");
    return;
  }

  try {
    // Create FormData and append content_id and public status
    console.log("contentId", contentId);
    const formData = new FormData();
    formData.append("content_id", contentId);  // Send the content ID
    formData.append("public", newStatus);      // Send the new public/private status
    
    console.log("form data", formData.get("content_id"));
    console.log("form data", formData.get("public")); 
    // Send PUT request to update the content's public/private status
    const response = await fetch(`http://localhost:8000/content/update/${contentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Do not set Content-Type header when using FormData
      },
      body: formData,  // Send the FormData as the body
    });

  
    const result = await response.json();
    if (response.ok) {
      console.log("Content updated:", result);
    } else {
      console.error("Failed to update content:", result);
    }
  } catch (error) {
    console.error("Error updating content:", error);
  }
  
};


  // Call fetchUserContents on component mount
  useEffect(() => {
    fetchUserContents();
  }, []);

  return (
    <main>
      <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 mt-8">
            <h2 className="text-lg font-medium">User Contents</h2>

            {/* Display error if there is any */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Display the contents if available */}
            {contents.length > 0 ? (
              <div className="grid grid-cols-12 gap-6 mt-5">
               {contents.map((content) => (
              <Card
                key={content.id}
                id={content.id} // Pass content id
                value={content.title} // Display the content title
                label={content.caption} // Display the content caption
                publicStatus={content.public} // Pass public status
                onStatusChange={(contentId, newStatus) => handleStatusChange(contentId, newStatus)} // Pass the function reference
              />
            ))}

              </div>
            ) : (
              !error && <p>Loading...</p> // Show loading state if contents are being fetched
            )}
          </div>
          <div className="ml-[40rem] flex justify-center items-center">
                <Chart chartOptions={chartOptions} /> {/* Use the Chart component here */}
              </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
