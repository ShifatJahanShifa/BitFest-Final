import React, { useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [subject, setSubject] = useState('');   // State for subject name
  const [photo, setPhoto] = useState(null);   // State for subject photo
  const [topic, setTopic] = useState('');     // State for topic
  const [subtopic, setSubtopic] = useState(''); // State for subtopic
  const [pdfResource, setPdfResource] = useState(null); // State for PDF file
  const [responseMessage, setResponseMessage] = useState(null);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setPdfResource(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-semibold mb-4">Add Subject</h1>

      <form onSubmit={handleSubmit}>
        {/* Subject Name */}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
            Subject Name
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter subject name"
            required
          />
        </div>

        {/* Subject Photo */}
        <div className="mb-4">
          <label htmlFor="photo" className="block text-gray-700 font-medium mb-2">
            Upload Subject Photo
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Topic */}
        <div className="mb-4">
          <label htmlFor="topic" className="block text-gray-700 font-medium mb-2">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter topic name"
            required
          />
        </div>

        {/* Subtopic */}
        <div className="mb-4">
          <label htmlFor="subtopic" className="block text-gray-700 font-medium mb-2">
            Subtopic
          </label>
          <input
            type="text"
            id="subtopic"
            value={subtopic}
            onChange={(e) => setSubtopic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter subtopic name"
            required
          />
        </div>

        {/* PDF Resource */}
        <div className="mb-4">
          <label htmlFor="pdf" className="block text-gray-700 font-medium mb-2">
            Upload Reading Resource (PDF)
          </label>
          <input
            type="file"
            id="pdf"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#de7f45] text-white py-2 px-4 rounded-md hover:bg-[#c7653a] transition duration-300"
        >
          Add Subject
        </button>
      </form>

      {/* Response Message */}
      {responseMessage && (
        <p className="mt-4 text-center text-gray-700">{responseMessage}</p>
      )}
    </div>
  );
};

export default Profile;
