import os
from dotenv import load_dotenv
import google.generativeai as genai


load_dotenv()

genai.configure(api_key=os.getenv('GOOGLE_GEMINI_API_KEY'))

model = genai.GenerativeModel('gemini-pro')

prompt = "Write a story about a magic backpack."
response = model.generate_content(prompt)

print(response.text) 