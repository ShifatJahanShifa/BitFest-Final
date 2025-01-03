import React, { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css'; // Import the Snow theme styles
import Quill from 'quill';
import './TextEditor.css'; // Custom styles
import axios from 'axios';
import { use } from 'react';

const TextEditor = () => {
  const editorRef = useRef(null);
  const [typingText, setTypingText] = useState("Banglish e lekha shuru korun.");
  const [showCursor, setShowCursor] = useState(true);
  const [response, setResponse] = useState(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState(""); // State for translated text
  const [showDialog, setShowDialog] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [privacy, setPrivacy] = useState('Public');

  useEffect(() => {
    // Typewriting effect
    const texts = ["Banglish e lekha shuru korun.", "Example: Ami bhat khai"];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentText = texts[index];
      if (isDeleting) {
        setTypingText(currentText.substring(0, charIndex--));
        if (charIndex < 0) {
          isDeleting = false;
          index = (index + 1) % texts.length; // Move to next text
        }
      } else {
        setTypingText(currentText.substring(0, charIndex++));
        if (charIndex > currentText.length) {
          isDeleting = true;
        }
      }
    };

    const typingInterval = setInterval(type, 150);
    return () => clearInterval(typingInterval);
  }, []);
  

  useEffect(() => {
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    // Initialize Quill when the component is mounted
    const quillInstance = new Quill(editorRef.current, {
      theme: 'snow', // Use the Snow theme
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'], // Formatting options
          [{ list: 'ordered' }, { list: 'bullet' }], // Lists
          [{ header: [1, 2, 3, false] }], // Header dropdown
        ],
      },
    });

    return () => {
      // Cleanup on unmount if needed
      quillInstance.disable();
    };
  }, []);

 
    

  const handleTranslate = async () => {
    const editorContent = editorRef.current.querySelector('.ql-editor').innerHTML;  // Get the HTML content from the editor
  
    try {
      // Create FormData to send the text as form data
      const formData = new FormData();
      formData.append('banglish_text', editorContent); // Append the text to formData
  
      // Send the text to the backend for translation
      const response = await fetch('http://localhost:8000/content/banglish-to-bangla/', {
        method: 'POST',
        body: formData, // Send FormData as the request body
      });
  
      if (!response.ok) {
        throw new Error('Translation failed');
      }
  
      const data = await response.json();
      let translatedText = data.translated_text;  // Extract the translated text
      console.log(translatedText);
  
      setTranslatedText(translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error('Error during translation:', error);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      // Make API call to backend
      const token = localStorage.getItem('token'); // Retrieve token from localStorage or state
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      };
  
      // Remove <p> tags from the translated text using a regular expression
      const cleanedText = translatedText.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
  
      const formData = new FormData();
      formData.append("bangla_text", cleanedText);
      console.log("formData", formData);
      console.log("cleanedText", cleanedText);
  
      const res = await axios.post("http://localhost:8000/content/generate-pdf", formData, config);
  
      // Extract title and link from the response
      const { title, caption, link } = res.data.content;
  
      // Prepare a response message for the dialog
      const responseMessage = {
        title,
        caption,
        link,
      };
  
      // Set the response message and show the dialog
      setResponse(responseMessage);
      console.log("PDF Generation Response: ", responseMessage);
      setShowDialog(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
  

  return (
    <div className="text-editor-container">
      {/* Heading with typing effect */}
      <div className="editor-heading mb-2">
        <span className="typing-demo">
          {typingText}
          {showCursor && <span className="cursor"></span>}
        </span>
      </div>
      {/* Editor */}
      <div ref={editorRef} className="editor-box" />
      <button className="bg-black text-white py-3 px-8 rounded-lg mt-5" onClick={handleTranslate}>
        Translate
      </button>

      {isTranslated && (
        <>
          {/* Display the translated content in a beautiful viewer card */}
          <div className="translated-card">
            <div className="card-header">
              <h3>Translated Text</h3>
            </div>
            <div className="card-body">
              <div dangerouslySetInnerHTML={{ __html: translatedText }} />
            </div>
          </div>

          {/* PDF generation dialog */}
          <button className="bg-black text-white py-3 px-8 rounded-lg mt-5" onClick={handleGeneratePDF}>
            Upload to PDF
          </button>

          {showDialog && response && (
            <div className="dialog-overlay">
              <div className="dialog-box">
                <h3>PDF Generated Successfully</h3>
                <p><strong>Title:</strong> {response.title}</p>
                <p><strong>Caption:</strong> {response.caption}</p>
                <p>
                  <strong>Link:</strong>{" "}
                  <a href={`http://localhost:8000/${response.link}`} target="_blank" rel="noopener noreferrer">
                    Open PDF
                  </a>
                </p>
                <button className="bg-black text-white py-3 px-8 rounded-lg mt-5" onClick={() => setShowDialog(false)}>Close</button>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default TextEditor;
