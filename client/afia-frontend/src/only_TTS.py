import os
import azure.cognitiveservices.speech as speechsdk

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

if __name__ == "__main__":
    # Example text input
    text = "Hello, how are you today?"
    text_to_speech(text)  # Call function with the desired text
