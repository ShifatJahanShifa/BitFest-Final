# import os
# from dotenv import load_dotenv
# import google.generativeai as genai
# import speech_recognition as sr
# import pyttsx3
# import pygame 
# import requests
# import time
# import azure.cognitiveservices.speech as speechsdk
# from datetime import date

# # Load environment variables from .env file
# load_dotenv()

# # Retrieve API keys and settings from the .env file
# google_api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
# speech_key = os.getenv("AZURE_SPEECH_KEY")
# service_region = os.getenv("AZURE_REGION")

# # Configure the Google Gemini API
# genai.configure(api_key=google_api_key)

# pygame.mixer.init()

# today = str(date.today())

# engine = pyttsx3.init()

# engine.setProperty('rate', 190) # speaking rate
# voices = engine.getProperty('voices')

# engine.setProperty('voice', voices[1].id) # 0 for male; 1 for female

# # model of Google Gemini API
# model = genai.GenerativeModel('gemini-pro')


# # Azure TTS Configuration Function
# def text_to_speech(input_text):
#     try:
#         # Create a speech config object
#         speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)

#         # Set the voice name (optional, default is en-US)
#         speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"

#         # Configure audio output to play directly through the default speaker
#         audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

#         # Create a speech synthesizer
#         synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

#         # Perform text-to-speech synthesis
#         result = synthesizer.speak_text_async(input_text).get()

#         # Check for successful synthesis
#         if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
#             print("Speech synthesis succeeded and is being played.")
#         else:
#             print(f"Speech synthesis failed: {result.reason}")

#     except Exception as e:
#         print(f"Error: {e}")


# # Function to log the conversation
# def append2log(text):
#     global today
#     fname = 'chatlog-' + today + '.txt'
#     with open(fname, "a") as f:
#         f.write(text + "\n")

# # Main function for conversation
# def main():
#     global talk, today, model  
#     rec = sr.Recognizer()
#     mic = sr.Microphone()
#     rec.dynamic_energy_threshold=False
#     rec.energy_threshold = 400    
    
#     sleeping = True 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
#     while True:     
#         with mic as source1:            
#             rec.adjust_for_ambient_noise(source1, duration= 0.5)

#             print("Listening ...")
            
#             try: 
#                 audio = rec.listen(source1, timeout = 10, phrase_time_limit = 15)
#                 text = rec.recognize_google(audio)
                
#                 # AI is in sleeping mode
#                 if sleeping == True:
#                     if "jack" in text.lower():
#                         request = text.lower().split("jack")[1]
                        
#                         sleeping = False
#                         append2log(f"_"*40)
#                         talk = []                        
#                         today = str(date.today()) 
                        
#                         if len(request) < 5:
#                             text_to_speech("Hi, there, how can I help?")  # Use Azure TTS function
#                             append2log(f"AI: Hi, there, how can I help? \n")
#                             continue

#                     else:
#                         continue
#                 else: 
#                     request = text.lower()

#                     if "that's all" in request:
#                         append2log(f"You: {request}\n")
#                         text_to_speech("Bye now")  # Use Azure TTS function
#                         append2log(f"AI: Bye now. \n")                        
#                         print('Bye now')
#                         sleeping = True
#                         continue
                    
#                     if "jack" in request:
#                         request = request.split("jack")[1]                        
                
#                 append2log(f"You: {request}\n ")
#                 print(f"You: {request}\n AI: " )
#                 talk.append({'role':'user', 'parts':[request]} )

#                 response = model.generate_content(talk, stream=True)
#                 for chunk in response:
#                     print(chunk.text, end='') 
#                     text_to_speech(chunk.text.replace("*", ""))  # Use Azure TTS function

#                 print('\n')
#                 talk.append({'role':'model', 'parts':[response.text]})
#                 append2log(f"AI: {response.text } \n")
 
#             except Exception as e:
#                 continue 

# if __name__ == "__main__":
#     main()


# import os
# from dotenv import load_dotenv
# import google.generativeai as genai
# import speech_recognition as sr
# import pyttsx3
# import pygame
# import requests
# import time
# import azure.cognitiveservices.speech as speechsdk
# from datetime import date
# import streamlit as st
# import threading

# # Load environment variables from .env file
# load_dotenv()

# # Retrieve API keys and settings from the .env file
# google_api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
# speech_key = os.getenv("AZURE_SPEECH_KEY")
# service_region = os.getenv("AZURE_REGION")

# # Configure the Google Gemini API
# genai.configure(api_key=google_api_key)

# # Initialize pygame mixer
# pygame.mixer.init()

# today = str(date.today())
# engine = pyttsx3.init()

# # Set voice properties
# engine.setProperty('rate', 190)  # speaking rate
# voices = engine.getProperty('voices')
# engine.setProperty('voice', voices[1].id)  # 0 for male; 1 for female

# # Model of Google Gemini API
# model = genai.GenerativeModel('gemini-pro')

# # Azure TTS Configuration Function
# def text_to_speech(input_text):
#     try:
#         speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
#         speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"
#         audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
#         synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
#         result = synthesizer.speak_text_async(input_text).get()

#         if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
#             print("Speech synthesis succeeded and is being played.")
#         else:
#             print(f"Speech synthesis failed: {result.reason}")

#     except Exception as e:
#         print(f"Error: {e}")

# # Function to log the conversation
# def append2log(text):
#     global today
#     fname = 'chatlog-' + today + '.txt'
#     with open(fname, "a") as f:
#         f.write(text + "\n")

# # Main function for conversation
# def main():
   
#     global talk, today, model  
#     rec = sr.Recognizer()
#     mic = sr.Microphone()
    
#     sleeping = True 
#     talk = []
    
#     st.title("Chat with AI")
#     st.subheader("Talk to Jack, your AI assistant!")

#     # Button to start listening
#     if st.button("Speak"):
#         with mic as source:
#             rec.adjust_for_ambient_noise(source)
#             st.write("Listening...")
#             audio = rec.listen(source)
#             try:
#                 user_input = rec.recognize_google(audio)
#                 st.write(f"You: {user_input}")
#             except sr.UnknownValueError:
#                 st.write("Sorry, I could not understand the audio.")
#                 return
#             except sr.RequestError:
#                 st.write("Could not request results from Google Speech Recognition service.")
#                 return
#     else:
#         user_input = st.text_input("Or type something (type 'jack' to start talking):")

#     if user_input:
#         # AI is in sleeping mode
#         if sleeping:
#             if "jack" in user_input.lower():
#                 request = user_input.lower().split("jack")[1]
#                 sleeping = False
#                 append2log(f"_"*40)
#                 talk = []                        
#                 today = str(date.today()) 
                
#                 if len(request) < 5:
#                     text_to_speech("Hi, there, how can I help?")
#                     append2log("AI: Hi, there, how can I help?\n")
#                     st.write("AI: Hi, there, how can I help?")
                    

#             else:
#                 st.write("AI: I'm asleep! Please say 'jack' to wake me up.")
#                 st.text("")  # Empty text to avoid clutter
#         else: 
#             request = user_input.lower()

#             if "that's all" in request:
#                 append2log(f"You: {request}\n")
#                 text_to_speech("Bye now")
#                 append2log("AI: Bye now.\n")
#                 st.write("AI: Bye now.")
#                 sleeping = True
            
#             if "jack" in request:
#                 request = request.split("jack")[1]                        

#         append2log(f"You: {request}\n")
#         st.write(f"You: {request}")
#         talk.append({'role':'user', 'parts':[request]} )

#         response = model.generate_content(talk, stream=True)
#         response_text = ""
        
#         for chunk in response:
#             response_text += chunk.text
#             text_to_speech(chunk.text.replace("*", ""))
        
#         st.write(f"AI: {response_text}")
#         append2log(f"AI: {response_text} \n")
 
# if __name__ == "__main__":
#     main()



###################################   runnable #######################################
# import os
# from dotenv import load_dotenv
# import google.generativeai as genai
# import speech_recognition as sr
# import pyttsx3
# import requests
# import azure.cognitiveservices.speech as speechsdk
# from datetime import date
# import streamlit as st

# # Load environment variables from .env file
# load_dotenv()

# # Retrieve API keys and settings from the .env file
# google_api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
# speech_key = os.getenv("AZURE_SPEECH_KEY")
# service_region = os.getenv("AZURE_REGION")

# # Configure the Google Gemini API
# genai.configure(api_key=google_api_key)

# today = str(date.today())
# engine = pyttsx3.init()
# engine.setProperty('rate', 190)
# voices = engine.getProperty('voices')
# engine.setProperty('voice', voices[1].id)

# model = genai.GenerativeModel('gemini-pro')

# def text_to_speech(input_text):
#     try:
#         speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
#         speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"
#         audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
#         synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
#         result = synthesizer.speak_text_async(input_text).get()

#         if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
#             print("Speech synthesis succeeded and is being played.")
#         else:
#             print(f"Speech synthesis failed: {result.reason}")

#     except Exception as e:
#         print(f"Error: {e}")

# def append2log(text):
#     global today
#     fname = 'chatlog-' + today + '.txt'
#     with open(fname, "a") as f:
#         f.write(text + "\n")

# def listen_to_audio():
#     rec = sr.Recognizer()
#     mic = sr.Microphone()
#     with mic as source:
#         rec.adjust_for_ambient_noise(source)
#         print("Listening...")
#         audio = rec.listen(source)
#         try:
#             user_input = rec.recognize_google(audio)
#             return user_input  # Return recognized text
#         except sr.UnknownValueError:
#             return "Sorry, I could not understand the audio."
#         except sr.RequestError:
#             return "Could not request results from Google Speech Recognition service."

# def main():
#     global talk
#     sleeping = True
#     talk = []

#     st.title("Chat with AI")
#     st.subheader("Talk to Jack, your AI assistant!")

#     # Callback for audio input
#     if st.button("Speak"):
#         st.write("Listening...")
#         user_input = listen_to_audio()  # Call directly without threading
#         st.session_state.user_input = user_input  # Store in session state
#         st.write(f"You: {user_input}")  # Display the recognized input

#     user_input = st.text_input("Or type something (type 'jack' to start talking):", key="user_input")

#     if user_input:
#         if sleeping:
#             if "jack" in user_input.lower():
#                 request = user_input.lower().split("jack")[1]
#                 sleeping = False
#                 append2log(f"_" * 40)
#                 talk = []
                
#                 if len(request) < 5:
#                     text_to_speech("Hi, there, how can I help?")
#                     append2log("AI: Hi, there, how can I help?\n")
#                     st.write("AI: Hi, there, how can I help?")
#             else:
#                 st.write("AI: I'm asleep! Please say 'jack' to wake me up.")
#         else:
#             request = user_input.lower()

#             if "that's all" in request:
#                 append2log(f"You: {request}\n")
#                 text_to_speech("Bye now")
#                 append2log("AI: Bye now.\n")
#                 st.write("AI: Bye now.")
#                 sleeping = True

#             if "jack" in request:
#                 request = request.split("jack")[1]

#         append2log(f"You: {request}\n")
#         st.write(f"You: {request}")
#         talk.append({'role': 'user', 'parts': [request]})

#         response = model.generate_content(talk, stream=True)
#         response_text = ""

#         for chunk in response:
#             response_text += chunk.text
#             text_to_speech(chunk.text.replace("*", ""))

#         st.write(f"AI: {response_text}")
#         append2log(f"AI: {response_text} \n")

# if __name__ == "__main__":
#     main()


import os
from dotenv import load_dotenv
import google.generativeai as genai
import speech_recognition as sr
import pyttsx3
import requests
import azure.cognitiveservices.speech as speechsdk
from datetime import date
import streamlit as st

# Load environment variables from .env file
load_dotenv()

# Retrieve API keys and settings from the .env file
google_api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
speech_key = os.getenv("AZURE_SPEECH_KEY")
service_region = os.getenv("AZURE_REGION")

# Configure the Google Gemini API
genai.configure(api_key=google_api_key)

today = str(date.today())
engine = pyttsx3.init()
engine.setProperty('rate', 190)
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)

model = genai.GenerativeModel('gemini-pro')

def text_to_speech(input_text):
    try:
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
        speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"
        audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
        result = synthesizer.speak_text_async(input_text).get()

        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("Speech synthesis succeeded and is being played.")
        else:
            print(f"Speech synthesis failed: {result.reason}")

    except Exception as e:
        print(f"Error: {e}")

def append2log(text):
    global today
    fname = 'chatlog-' + today + '.txt'
    with open(fname, "a") as f:
        f.write(text + "\n")

def listen_to_audio():
    rec = sr.Recognizer()
    mic = sr.Microphone()
    with mic as source:
        rec.adjust_for_ambient_noise(source)
        print("Listening...")
        audio = rec.listen(source)
        try:
            user_input = rec.recognize_google(audio)
            return user_input  # Return recognized text
        except sr.UnknownValueError:
            return "Sorry, I could not understand the audio."
        except sr.RequestError:
            return "Could not request results from Google Speech Recognition service."

def main():
    global talk
    sleeping = True
    talk = []
    request = ""  # Initialize request to an empty string

    st.title("Chat with AI")
    st.subheader("Talk to Jack, your AI assistant!")

    with st.sidebar:
        st.markdown("[Back](http://localhost:5174)")

    # Callback for audio input
    if st.button("Speak"):
        st.write("Listening...")
        user_input = listen_to_audio()  # Call directly without threading
        st.session_state.user_input = user_input  # Store in session state
        st.write(f"You: {user_input}")  # Display the recognized input
        request = user_input  # Set request based on user input

    user_input = st.text_input("Or type something (type 'jack' to start talking):", key="user_input")

    if user_input:
        if sleeping:
            if "jack" in user_input.lower():
                request = user_input.lower().split("jack")[1].strip()  # Update request
                sleeping = False
                append2log(f"_" * 40)
                talk = []
                
                if len(request) < 5:
                    text_to_speech("Hi, there, how can I help?")
                    append2log("AI: Hi, there, how can I help?\n")
                    st.write("AI: Hi, there, how can I help?")
            else:
                st.write("AI: I'm asleep! Please say 'jack' to wake me up.")
        else:
            request = user_input.lower()  # Update request

            if "that's all" in request:
                append2log(f"You: {request}\n")
                text_to_speech("Bye now")
                append2log("AI: Bye now.\n")
                st.write("AI: Bye now.")
                sleeping = True

            if "jack" in request:
                request = request.split("jack")[1].strip()  # Update request

        append2log(f"You: {request}\n")  # Log the user's request
        st.write(f"You: {request}")
        talk.append({'role': 'user', 'parts': [request]})

        response = model.generate_content(talk, stream=True)
        response_text = ""

        for chunk in response:
            response_text += chunk.text
            text_to_speech(chunk.text.replace("*", ""))

        st.write(f"AI: {response_text}")
        append2log(f"AI: {response_text} \n")

if __name__ == "__main__":
    main()
