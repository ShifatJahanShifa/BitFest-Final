import io
import os
import time
from tkinter import Tk, filedialog
from dotenv import load_dotenv
import requests
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Set Azure Computer Vision API credentials
AZURE_ENDPOINT = os.getenv("AZURE_COMPUTER_VISION_ENDPOINT")
AZURE_SUBSCRIPTION_KEY = os.getenv("AZURE_COMPUTER_VISION_SUBSCRIPTION_KEY")

# Retrieve the Gemini API key
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)


def extract_handwriting_from_png(image_path):
    """Extracts handwritten text from a PNG image using Azure Computer Vision."""
    if not AZURE_ENDPOINT or not AZURE_SUBSCRIPTION_KEY:
        raise ValueError("Azure credentials are not set in the environment variables.")

    with open(image_path, "rb") as image_file:
        image_data = image_file.read()

    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_SUBSCRIPTION_KEY,
        "Content-Type": "application/octet-stream",
    }

    # Azure OCR endpoint
    ocr_url = f"{AZURE_ENDPOINT}/vision/v3.2/read/analyze"

    # Send the request to Azure
    response = requests.post(ocr_url, headers=headers, data=image_data)
    response.raise_for_status()

    # Get the operation location (URL to retrieve the result)
    operation_url = response.headers.get("Operation-Location")
    if not operation_url:
        raise ValueError("Failed to retrieve the operation URL from the Azure response.")

    # Poll for the result
    print("Processing image... This may take a few seconds.")
    while True:
        result_response = requests.get(operation_url, headers={"Ocp-Apim-Subscription-Key": AZURE_SUBSCRIPTION_KEY})
        result = result_response.json()
        if "status" in result:
            if result["status"] == "succeeded":
                break
            elif result["status"] == "failed":
                raise ValueError("Azure OCR processing failed.")
        time.sleep(1)  # Wait before polling again

    # Extract text from the result
    extracted_text = ""
    if "analyzeResult" in result and "readResults" in result["analyzeResult"]:
        for page in result["analyzeResult"]["readResults"]:
            for line in page.get("lines", []):
                extracted_text += line["text"] + "\n"

    return extracted_text.strip()


def improve_writing_with_gemini(text_to_improve, prompt="Improve the following text for clarity, grammar, and style:"):
    """Improves writing using the Gemini API."""
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-pro')

        # Generate content using the model
        response = model.generate_content(f"{prompt}\n{text_to_improve}")

        # Return the improved text
        return response.text if response else None

    except Exception as e:
        print(f"Error using Gemini API: {e}")
        return None


def select_image_file():
    """Open a file dialog to select an image file."""
    root = Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename(
        title="Select an Image File",
        filetypes=[("PNG Files", "*.png"), ("JPG Files" , "*.jpg"), ("All Files", "*.*")]
    )
    return file_path


def main():
    print("Select an image file using the file dialog.")
    image_path = select_image_file()

    if not image_path:
        print("No file selected. Exiting...")
        return

    try:
        # 1. Extract Handwriting
        extracted_text = extract_handwriting_from_png(image_path)
        if extracted_text:
            print("\nExtracted Text:\n", extracted_text)
        else:
            print("No text detected in the image.")
            return

        # 2. Improve Writing with Gemini
        improved_text = improve_writing_with_gemini(extracted_text)

        if improved_text:
            print("\nImproved Text (Gemini):\n", improved_text)
        else:
            print("Failed to improve the text.")

    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
    except requests.exceptions.RequestException as e:
        print(f"Error with Azure Computer Vision API: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
