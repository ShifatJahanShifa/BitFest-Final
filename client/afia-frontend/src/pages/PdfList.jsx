import React, { useEffect, useState } from 'react';

const PdfList = ({ userId }) => {
  const [userPdfs, setUserPdfs] = useState([]);

  useEffect(() => {
    // You can filter PDFs based on the userId here, for example:
    const filteredPdfs = pdfs.filter(pdf => {
      return pdf.public || (userId && userId % 2 === 0); // Example condition for filtering PDFs by userId
    });

    setUserPdfs(filteredPdfs); // Set the filtered PDFs for the user
  }, [userId]); // Re-run the effect when userId changes

  if (!userId) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">Your PDFs:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {userPdfs.length > 0 ? (
          userPdfs.map((pdf) => (
            <div key={pdf.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-medium">{pdf.title}</h4>
              <p>{pdf.caption}</p>
              <a href={pdf.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">View PDF</a>
            </div>
          ))
        ) : (
          <p>No PDFs available for your user.</p>
        )}
      </div>
    </div>
  );
};

export default PdfList;
