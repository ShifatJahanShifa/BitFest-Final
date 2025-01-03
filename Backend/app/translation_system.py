import streamlit as st
from transformers import MT5ForConditionalGeneration, AutoTokenizer
import torch

#  myyyy
# Use a pipeline as a high-level helper
# from transformers import pipeline

# pipe = pipeline("text2text-generation", model="Shifa1301/banglish-to-bengali-model")

# # Load model directly
# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# tokenizer = AutoTokenizer.from_pretrained("Shifa1301/banglish-to-bengali-model")
# model = AutoModelForSeq2SeqLM.from_pretrained("Shifa1301/banglish-to-bengali-model")

# mmyyyy

model_path = "./banglish-to-bengali-model"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = MT5ForConditionalGeneration.from_pretrained(model_path).to("cpu")


# for testing purpose  

st.title("Banglish to Bangla Transliteration")
banglish_text = st.text_area("Enter Banglish Text:", "")

if st.button("Transliterate"):
    if banglish_text.strip():
        inputs = tokenizer(banglish_text, return_tensors="pt", max_length=128, truncation=True, padding="max_length")
        outputs = model.generate(**inputs)
        bangla_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        st.success(bangla_text)
    else:
        st.warning("Please enter Banglish text.")