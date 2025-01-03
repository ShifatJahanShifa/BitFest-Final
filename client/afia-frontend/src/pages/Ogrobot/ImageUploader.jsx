import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [imageFile, setImageFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [analyzedText, setAnalyzedText] = useState('');
  const [error, setError] = useState('');

  // Handle image file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      console.log("Uploading image...");
      const uploadResponse = await axios.post('http://localhost:8000/ai/upload_image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const filePath = uploadResponse.data.file_path;
      console.log("Image uploaded. File path:", filePath);

      // Call extract and analyze endpoints
      await extractText(filePath);
      await analyzeImage(filePath);
    } catch (err) {
      setError('Error uploading image or processing file.');
      console.error("Upload Error:", err);
    }
  };

  const extractText = async (filePath) => {
    try {
      console.log("Extracting text...");
      const response = await axios.post(
        'http://localhost:8000/ai/extract_from_image',
        { file_path: filePath, prompt: 'Extract the text in the image verbatim' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setExtractedText(response.data.extracted_text);
      console.log("Extracted Text:", response.data.extracted_text);
    } catch (err) {
      setError('Error extracting text from the image.');
      console.error("Extraction Error:", err);
    }
  };

  const analyzeImage = async (filePath) => {
    try {
      console.log("Analyzing image...");
      const response = await axios.post(
        'http://localhost:8000/ai/analyze_image',
        { file_path: filePath, prompt: 'Analyze the given diagram and carefully extract the information.' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAnalyzedText(response.data.analyzed_text);
      console.log("Analyzed Information:", response.data.analyzed_text);
    } catch (err) {
      setError('Error analyzing the image.');
      console.error("Analysis Error:", err);
    }
  };

  return (
    <div>
      <h1>Upload Image for Extraction and Analysis</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={uploadImage}>Upload and Process Image</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {extractedText && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{extractedText}</p>
        </div>
      )}
      {analyzedText && (
        <div>
          <h2>Analyzed Information:</h2>
          <p>{analyzedText}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
