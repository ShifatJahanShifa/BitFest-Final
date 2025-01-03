import os

from groq import Groq

client = Groq(
    api_key="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",
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Explain the difference between a llama and an alpaca.",
        }
    ],
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)

