import os
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv

# Load environment variables (you should have these in your .env file)
load_dotenv()

AZURE_SPEECH_KEY = os.getenv('AZURE_SPEECH_KEY')
AZURE_REGION = os.getenv('AZURE_REGION')

def recognize_speech_from_microphone():
    """Recognizes speech from the microphone and converts it to text using Azure Speech API."""
    if not AZURE_SPEECH_KEY or not AZURE_REGION:
        raise ValueError("Azure Speech API credentials are not set in the environment variables.")
    
    # Create a speech configuration instance with your API key and region
    speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_REGION)

    # Set up the microphone input
    audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)

    # Create a speech recognizer with the specified settings
    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    print("Say something...")

    # Start continuous speech recognition and print the recognized text
    result = recognizer.recognize_once()

    # Check the result and print the recognized text
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("Recognized: ", result.text)
        return result.text
    elif result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized.")
    elif result.reason == speechsdk.ResultReason.Canceled:
        print("Speech recognition canceled: ", result.cancellation_details.error_details)

    return None

def main():
    recognized_text = recognize_speech_from_microphone()
    if recognized_text:
        print(f"Recognized Text: {recognized_text}")

if __name__ == "__main__":
    main()
