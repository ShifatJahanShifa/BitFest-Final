from fastapi import APIRouter, HTTPException, Form, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas  # For PDF generation
from langchain_community.chat_models import ChatOpenAI  # Updated import
from langchain.prompts import ChatPromptTemplate
from langchain.schema import SystemMessage, HumanMessage
from dotenv import load_dotenv
import os
import uuid

from ..database import get_db
from ..oauth2 import get_current_user
from ..tables import Content  # Import the Content model

router = APIRouter(
    prefix="/content",
    tags=["Content"]
)

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


@router.post("/generate-pdf")
async def generate_pdf(
    bangla_text: str = Form(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]

    try:
        # Step 1: Generate Title and Caption using LLM
        llm = ChatOpenAI(model="gpt-4", temperature=0.7, openai_api_key=OPENAI_API_KEY)
        prompt = ChatPromptTemplate.from_messages([  # Create the prompt with a system and human message
            SystemMessage(content="আপনি একজন বুদ্ধিমান সহকারী। আপনার কাজ হল প্রদত্ত বাংলা লেখার জন্য একটি উপযুক্ত শিরোনাম এবং একটি ছোট ক্যাপশন তৈরি করা।"),
            HumanMessage(content=f"লেখা:\n{bangla_text}\n\nশিরোনাম এবং ক্যাপশন তৈরি করুন।")
        ])
        result = llm.predict_messages(prompt.messages)

        # Parse the response into title and caption
        if "\n" in result.content:
            title, caption = result.content.split("\n", 1)
        else:
            raise ValueError("Incomplete response format: Title and caption not separated by newline.")

        title = title.strip()
        caption = caption.strip()

        # Step 2: Generate PDF using reportlab
        unique_filename = f"{uuid.uuid4()}.pdf"
        file_path = Path(__file__).resolve().parent.parent / "pdfs" / unique_filename
        file_path.parent.mkdir(exist_ok=True, parents=True)

        # Create the PDF with reportlab
        c = canvas.Canvas(str(file_path), pagesize=letter)
        width, height = letter

        # Add Title to PDF
        c.setFont("Helvetica-Bold", 16)
        c.drawString(72, height - 72, title)  # Start 1 inch from the top-left corner

        # Add Caption to PDF
        c.setFont("Helvetica", 12)
        c.drawString(72, height - 100, caption)

        # Add Bangla Text
        c.setFont("Helvetica", 10)
        text_object = c.beginText(72, height - 140)  # Start Bangla text below title and caption
        text_object.setFont("Helvetica", 10)
        text_object.textLines(bangla_text)
        c.drawText(text_object)

        c.save()

        # Step 3: Save Metadata in Database
        new_content = Content(
            user_id=user_id,
            link=str(file_path),
            title=title,
            caption=caption,
            public=True,  # Default to public
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(new_content)
        db.commit()
        db.refresh(new_content)

        return {
            "message": "PDF generated and content saved successfully.",
            "content": {
                "id": new_content.id,
                "title": title,
                "caption": caption,
                "link": str(file_path),
                "public": new_content.public
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
