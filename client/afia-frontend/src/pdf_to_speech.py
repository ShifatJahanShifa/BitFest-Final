import os
import tkinter as tk
from tkinter import filedialog, messagebox
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
import PyPDF2

# Load environment variables
load_dotenv()

# Load Azure API credentials
speech_key = os.getenv("AZURE_SPEECH_KEY")
service_region = os.getenv("AZURE_REGION")

def text_to_speech(input_text):
    try:
        # Azure Speech-to-Text configuration
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
        speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"  # You can change this voice

        # Output to the default speaker
        audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

        # Create a synthesizer with the given configurations
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

        # Synthesize the text to speech
        result = synthesizer.speak_text_async(input_text).get()

        # Check the result
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("Speech synthesis succeeded.")
        else:
            print(f"Speech synthesis failed: {result.reason}")

    except Exception as e:
        print(f"Error: {e}")

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, "rb") as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in range(len(pdf_reader.pages)):
                text += pdf_reader.pages[page].extract_text() + "\n"
            return text
    except Exception as e:
        messagebox.showerror("Error", f"Error reading PDF: {e}")
        return None

def open_pdf():
    # Open a file dialog to select a PDF
    file_path = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
    if file_path:
        # Extract text from the PDF
        pdf_text = extract_text_from_pdf(file_path)
        if pdf_text:
            text_to_speech(pdf_text)  # Convert PDF text to speech

# Tkinter window setup
root = tk.Tk()
root.title("PDF to Speech")
root.geometry("300x150")

# Button to open a PDF file
btn_open_pdf = tk.Button(root, text="Open PDF", command=open_pdf)
btn_open_pdf.pack(pady=50)

root.mainloop()
