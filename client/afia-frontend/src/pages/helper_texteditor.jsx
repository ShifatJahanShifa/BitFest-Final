
import React, { useEffect, useRef, useState } from 'react'; 
import 'quill/dist/quill.snow.css'; // Import the Snow theme styles 
import Quill from 'quill'; 
import './TextEditor.css'; // Custom styles 
import jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas'; 
 
const TextEditor = () => { 
  const editorRef = useRef(null); 
  const [typingText, setTypingText] = useState("Banglish e lekha shuru korun."); 
  const [showCursor, setShowCursor] = useState(true); 
 
  const [isTranslated, setIsTranslated] = useState(false); 
  const [showDialog, setShowDialog] = useState(false); 
  const [pdfName, setPdfName] = useState(''); 
  const [privacy, setPrivacy] = useState('Public'); 
 
  useEffect(() => { 
    // Typewriting effect 
    const texts = ["Banglish e lekha shuru korun.", "বাংলায় লেখা শুরু করুন"]; 
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
 
  const handleTranslate = () => { 
    // Simulate translation process 
    setTimeout(() => { 
      setIsTranslated(true); 
    }, 1000); 
  }; 
 
  const handleGeneratePdf = () => { 
    const editorContent = editorRef.current.querySelector('.ql-editor'); 
    html2canvas(editorContent).then((canvas) => { 
      const imgData = canvas.toDataURL('image/png'); 
      const pdf = new jsPDF('p', 'mm', 'a4'); 
      const imgWidth = 210; // Width of A4 in mm 
      const pageHeight = 297; // Height of A4 in mm 
      const imgHeight = (canvas.height * imgWidth) / canvas.width; 
 
      let heightLeft = imgHeight; 
      let position = 0; 
 
      // Add the image to the PDF 
      while (heightLeft > 0) { 
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); 
        heightLeft -= pageHeight; 
        position -= pageHeight; 
        if (heightLeft > 0) { 
          pdf.addPage(); 
        } 
      } 
 
      pdf.save(`${pdfName || 'Untitled'}.pdf`); 
    }); 
 
    setShowDialog(false); 
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
          <button className="upload-pdf-button" onClick={() => setShowDialog(true)}> 
            Upload to PDF 
          </button> 
          {showDialog && ( 
            <div className="dialog-overlay"> 
              <div className="dialog-box">
              <h3>Generate PDF</h3> 
                <label> 
                  File Name: 
                  <input 
                    type="text" 
                    value={pdfName} 
                    onChange={(e) => setPdfName(e.target.value)} 
                    placeholder="Enter PDF Name" 
                  /> 
                </label> 
                <label> 
                  Privacy: 
                  <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}> 
                    <option value="Public">Public</option> 
                    <option value="Private">Private</option> 
                  </select> 
                </label> 
                <div className="dialog-actions"> 
                  <button onClick={handleGeneratePdf}>Generate</button> 
                  <button onClick={() => setShowDialog(false)}>Cancel</button> 
                </div> 
              </div> 
            </div> 
          )} 
        </> 
      )} 
    </div> 
  ); 
}; 
 
export default TextEditor; 

