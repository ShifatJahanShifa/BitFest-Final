from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from typing import List
from ..database import get_db
from ..tables import Chat
from ..oauth2 import get_current_user
import os
from dotenv import load_dotenv
from pathlib import Path

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Load API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


@router.post("/")
async def chatbot(
    message: str = Form(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]

    # Fetch recent chat history for context
    recent_chats = (
        db.query(Chat)
        .filter(Chat.user_id == user_id)
        .order_by(Chat.timestamp.desc())
        .limit(10)  # Fetch last 5 messages
        .all()
    )

    # Format chat history for LLM
    chat_context = "\n".join(
        [f"User: {chat.message}\nChatbot: {chat.response}" for chat in reversed(recent_chats)]
    )

    # Add user message to context
    chat_context += f"\nUser: {message}"

    # Initialize LLM and construct the prompt
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "আপনি একজন কথোপকথন সহকারী। আপনার কাজ হল ব্যবহারকারীর প্রশ্নগুলির উত্তর দেওয়া এবং এটি সবসময় বাংলাতে করতে হবে। প্রশ্নগুলো বাংলা বা ইংরেজি অক্ষরে বাংলায় লেখা হতে পারে। ",
            ),
            (
                "human",
                f"""
                কথোপকথনের প্রেক্ষাপট:
                {chat_context}

                নতুন প্রশ্ন:
                {message}

                আপনার উত্তর সবসময় বাংলাতে হওয়া উচিত এবং প্রাসঙ্গিক হতে হবে।
                """,
            ),
        ]
    )

    # Use OpenAI instead of Gemini
    llm = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-4o")  # You can specify different models like gpt-3.5-turbo or gpt-4
    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser

    try:
        # Generate response
        response = chain.invoke({})

        # Save the chat to the database
        new_chat = Chat(user_id=user_id, message=message, response=response)
        db.add(new_chat)
        db.commit()

        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@router.get("/")
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]

    # Query all chats for the user
    chats = db.query(Chat).filter(Chat.user_id == user_id).order_by(Chat.timestamp).all()

    if not chats:
        return {"message": "No chat history found."}

    return {"chat_history": [{"message": chat.message, "response": chat.response, "timestamp": chat.timestamp} for chat in chats]}
