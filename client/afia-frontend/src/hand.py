import os
import pytesseract
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
import tkinter as tk
from tkinter import filedialog

# Load environment variables from .env file
load_dotenv()

# Retrieve the API key from .env
google_api_key = os.getenv("GOOGLE_GEMINI_API_KEY")

# Configure the Gemini API
genai.configure(api_key=google_api_key)

def ocr_image_to_text(image_path):
    """Extract text from an image using OCR."""
    try:
        # Check if the file exists
        if not os.path.exists(image_path):
            print(f"Error: The file at {image_path} does not exist.")
            return None
        
        # Open the image
        img = Image.open(image_path)

        # Use pytesseract to extract text from the image
        text = pytesseract.image_to_string(img)

        return text
    except Exception as e:
        print(f"Error extracting text from image: {e}")
        return None

def analyze_text_with_gemini(text):
    """Analyze the extracted text using the Gemini API."""
    try:
        # Prepare the input for the Gemini model
        talk = [{'role': 'user', 'parts': [text]}]
        
        # Generate a response from the Gemini API
        response = genai.GenerativeModel('gemini-pro').generate_content(talk)
        feedback = ""

        # Extract feedback or response text
        for chunk in response:
            feedback += chunk.text

        return feedback
    except Exception as e:
        print(f"Error analyzing text with Gemini: {e}")
        return None

def provide_feedback(essay_text):
    """Provide feedback on the essay by analyzing grammar, structure, and creativity."""
    # Get feedback from Gemini API
    feedback = analyze_text_with_gemini(essay_text)
    
    if feedback:
        print("Feedback on your essay:")
        print(feedback)
    else:
        print("Sorry, we couldn't generate feedback at this time.")

def select_image_file():
    """Open a file dialog to select an image file."""
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename(
        title="Select an Image",
        filetypes=[("Image Files", "*.png;*.jpg;*.jpeg;*.bmp;*.gif")]
    )
    return file_path

def main():
    # Select the image using the file dialog
    image_path = select_image_file()

    if not image_path:
        print("No file selected. Exiting.")
        return
    
    # Extract text from the image using OCR
    essay_text = ocr_image_to_text(image_path)
    
    if essay_text:
        print("\nExtracted Text from Handwritten Essay:")
        print(essay_text)
        
        # Provide feedback on the essay
        provide_feedback(essay_text)
    else:
        print("Failed to extract text from the image.")

if __name__ == "__main__":
    main()
