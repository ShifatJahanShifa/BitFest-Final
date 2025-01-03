import os
import tkinter as tk
from tkinter import filedialog, messagebox
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
import PyPDF2
import threading

# Load environment variables
load_dotenv()

# Load Azure API credentials
speech_key = os.getenv("AZURE_SPEECH_KEY")
service_region = os.getenv("AZURE_REGION")

# Global flags to track speech synthesis and stop state
is_speaking = False
is_stopped = False  # To track if speech is stopped
synthesizer = None
speech_thread = None  # To store the speech thread
extracted_text = ""  # Global variable to store extracted PDF text

def text_to_speech(input_text):
    global synthesizer, is_speaking, speech_thread, is_stopped
    try:
        # Azure Speech-to-Text configuration
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
        speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"  # You can change this voice

        # Output to the default speaker
        audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

        # Create a synthesizer with the given configurations
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

        def speak_text():
            nonlocal input_text
            result = synthesizer.speak_text_async(input_text).get()

            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                print("Speech synthesis succeeded.")
            else:
                print(f"Speech synthesis failed: {result.reason}")

            # Mark speech as finished
            global is_speaking, is_stopped
            is_speaking = False
            is_stopped = False  # Reset the stopped flag after synthesis completes

        # Check if already speaking, if so, don't start a new speech process
        if not is_speaking and not is_stopped:
            # Run speech synthesis in a separate thread to keep the UI responsive
            is_speaking = True
            speech_thread = threading.Thread(target=speak_text)
            speech_thread.start()

        else:
            print("Speech is already running or stopped.")

    except Exception as e:
        print(f"Error: {e}")

def stop_speech():
    global is_speaking, is_stopped, synthesizer
    if is_speaking:
        # Stop the speech synthesis
        synthesizer.stop_speaking_async()
        is_speaking = False
        is_stopped = True  # Mark speech as stopped
        print("Speech stopped.")

def resume_speech():
    global is_speaking, is_stopped
    if is_stopped:
        # Resume speech synthesis (start a new session if it was stopped)
        text_to_speech(extracted_text)
        is_stopped = False
        print("Speech resumed.")

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
    global extracted_text
    # Open a file dialog to select a PDF
    file_path = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
    if file_path:
        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(file_path)
        if extracted_text:
            text_to_speech(extracted_text)  # Convert PDF text to speech

# Tkinter window setup
root = tk.Tk()
root.title("PDF to Speech")
root.geometry("300x300")

# Button to open a PDF file
btn_open_pdf = tk.Button(root, text="Open PDF", command=open_pdf)
btn_open_pdf.pack(pady=20)

# Button to stop speech
btn_stop = tk.Button(root, text="Stop Speech", command=stop_speech)
btn_stop.pack(pady=10)

# Button to resume speech
btn_resume = tk.Button(root, text="Resume Speech", command=resume_speech)
btn_resume.pack(pady=10)

# Button to close the application
def close_application():
    global synthesizer
    if synthesizer:
        synthesizer.stop_speaking_async()  # Stop any speech when closing
    root.quit()  # Close the Tkinter application

btn_close = tk.Button(root, text="Close", command=close_application)
btn_close.pack(pady=20)

root.mainloop()
