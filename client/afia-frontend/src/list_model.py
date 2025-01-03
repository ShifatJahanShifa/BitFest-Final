import google.generativeai as genai

genai.configure(api_key="GOOGLE_GEMINI_API_KEY")  # Replace with your API key

models = genai.list_models()
for model in models:
    print(model)
