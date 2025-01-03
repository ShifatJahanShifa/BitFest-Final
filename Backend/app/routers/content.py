from fastapi import APIRouter, HTTPException, Form, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from sqlalchemy import or_
from reportlab.pdfgen import canvas  # For PDF generation
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from langchain_community.chat_models import ChatOpenAI  # Updated import
from langchain.prompts import ChatPromptTemplate
from langchain.schema import SystemMessage, HumanMessage
from dotenv import load_dotenv
import os
import uuid
from PyPDF2 import PdfReader

from ..database import get_db
from ..oauth2 import get_current_user
from ..tables import Content, User  # Import the Content model

router = APIRouter(
    prefix="/content",
    tags=["Content"]
)

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# Register custom Bangla font
font_dir = Path(__file__).parent.parent / "font"  # Path to your fonts directory
font_name = "SolaimanLipi_20-04-07.ttf"
font_path = str(font_dir / f"{font_name}")  # Path to your custom font file
pdfmetrics.registerFont(TTFont(font_name, font_path))  # Register the custom font


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
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="আপনি একজন বুদ্ধিমান সহকারী। প্রদত্ত বাংলা লেখার জন্য শিরোনাম এবং ক্যাপশন তৈরি করুন।"),
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

        # Step 2: Generate PDF
        unique_filename = f"{uuid.uuid4()}.pdf"
        cwd = Path(os.getcwd())
        file_path = cwd / "pdfs" / unique_filename
        file_path.parent.mkdir(exist_ok=True, parents=True)

        # Create the PDF
        c = canvas.Canvas(str(file_path), pagesize=letter)
        width, height = letter

        # Add Title (adjust positioning)
        c.setFont(font_name, 16)  # Use custom Bangla font for title
        title_text = c.beginText(72, height - 72)
        title_text.setFont(font_name, 16)
        title_text.textLines(title)  # Use textLines instead of drawString
        c.drawText(title_text)

        # Add Caption (adjust positioning)
        c.setFont(font_name, 12)  # Use custom Bangla font for caption
        caption_text = c.beginText(72, height - 100)
        caption_text.setFont(font_name, 12)
        caption_text.textLines(caption)  # Use textLines instead of drawString
        c.drawText(caption_text)
        # Add Bangla Text with proper line spacing and word wrapping
        c.setFont(font_name, 10)  # Use custom Bangla font for text
        text_object = c.beginText(72, height - 140)  # Start text at a fixed position
        text_object.setFont(font_name, 10)  # Set font size for Bangla text

        # Calculate line breaks to prevent text from going off the page
        max_width = width - 144  # 1-inch margin on both sides
        lines = []
        current_line = ""
        words = bangla_text.split()

        # Manually wrap text to fit within the page width
        for word in words:
            test_line = f"{current_line} {word}".strip()
            text_width = c.stringWidth(test_line, font_name, 10)

            if text_width < max_width:
                current_line = test_line
            else:
                lines.append(current_line)
                current_line = word

        lines.append(current_line)  # Append the last line

        # Write wrapped text to PDF
        for line in lines:
            text_object.textLine(line)

        c.drawText(text_object)

        c.save()

        # Step 3: Save Metadata in Database
        relative_file_path = str(file_path.relative_to(cwd))

        new_content = Content(
            user_id=user_id,
            link=relative_file_path,
            title=title,
            caption=caption,
            public=True,
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
                "link": relative_file_path,
                "public": new_content.public
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



@router.put("/update/{content_id}")
async def update_content(
    content_id: int,
    public: bool = Form(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]

    try:
        # Step 1: Fetch the existing content by its ID
        content = db.query(Content).filter(Content.id == content_id, Content.user_id == user_id).first()

        if not content:
            raise HTTPException(status_code=404, detail="Content not found or not owned by the user.")

        # Step 2: Update the content's metadata
        content.public = public  # Update the public/private flag
        content.updated_at = datetime.utcnow()  # Set the updated timestamp

        db.commit()
        db.refresh(content)  # Refresh to reflect changes in the content object

        return {
            "message": "Content updated successfully.",
            "content": {
                "id": content.id,
                "title": content.title,
                "caption": content.caption,
                "link": content.link,
                "public": content.public,
                "updated_at": content.updated_at
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.delete("/delete-pdf/{content_id}")
async def delete_pdf(content_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Get the user_id from the current user
    user_id = current_user["user_id"]
    
    try:
        # Step 1: Find the content record by ID
        content = db.query(Content).filter(Content.id == content_id, Content.user_id == user_id).first()

        if not content:
            raise HTTPException(status_code=404, detail="Content not found or not authorized to delete it")

        # Step 2: Delete the PDF file from the filesystem
        file_path = Path(content.link)  # Get the relative path from the database
        if file_path.exists():
            os.remove(file_path)  # Delete the file from the filesystem
        else:
            raise HTTPException(status_code=404, detail="PDF file not found on the server")

        # Step 3: Delete the record from the database
        db.delete(content)
        db.commit()

        return {"message": "PDF and content deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/get-contents")
async def get_user_contents(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]

    try:
        # Step 1: Retrieve all contents for the logged-in user
        contents = db.query(Content).filter(Content.user_id == user_id).all()

        # Step 2: If no contents are found, raise an exception
        if not contents:
            raise HTTPException(status_code=404, detail="No contents found for the logged-in user")

        # Step 3: Return the list of contents
        return {
            "message": "Contents retrieved successfully",
            "contents": [
                {
                    "id": content.id,
                    "title": content.title,
                    "caption": content.caption,
                    "link": content.link,
                    "public": content.public,
                    "created_at": content.created_at,
                    "updated_at": content.updated_at
                }
                for content in contents
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/get-public-contents/{target_user_id}")
async def get_public_contents_by_user(target_user_id: int, db: Session = Depends(get_db)):
    try:
        # Step 1: Retrieve all public contents for the target user
        contents = db.query(Content).filter(Content.user_id == target_user_id, Content.public == True).all()

        # Step 2: If no public contents are found, raise an exception
        if not contents:
            raise HTTPException(status_code=404, detail="No public contents found for this user")

        # Step 3: Return the list of public contents
        return {
            "message": "Public contents retrieved successfully",
            "contents": [
                {
                    "id": content.id,
                    "title": content.title,
                    "caption": content.caption,
                    "link": content.link,
                    "public": content.public,
                    "created_at": content.created_at,
                    "updated_at": content.updated_at
                }
                for content in contents
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/search/")
async def search_content(
    search_query: str = Query(..., min_length=1, description="Search term for username or content title"),
    filter_by: str = Query(None, description="Filter by 'user' or 'content'"),
    db: Session = Depends(get_db)
):
    try:
        # Search for contents matching the search_query
        if filter_by == "user":
            # Filter by user's username
            results = db.query(Content).join(User).filter(
                User.name.ilike(f"%{search_query}%"),
                Content.user_id == User.id,
                Content.public == True  # Only public contents
            ).all()
        elif filter_by == "content":
            search_query =  helping_func(search_query)
            # Filter by content's title
            results = db.query(Content).filter(
                Content.title.ilike(f"%{search_query}%"),
                Content.public == True  # Only public contents
            ).all()
        else:
            search_query =  helping_func(search_query)
            # Default to search by both username and content title
            results = db.query(Content).join(User).filter(
                or_(
                    User.name.ilike(f"%{search_query}%"),
                    Content.title.ilike(f"%{search_query}%")
                ),
                Content.public == True  # Only public contents
            ).all()

        if not results:
            return {"message": "No matching results found."}

        # Return the results
        return {
            "results": [
                {
                    "id": content.id,
                    "title": content.title,
                    "caption": content.caption,
                    "link": content.link,
                    "public": content.public,
                    "user_name": content.user.name,  # Assuming the User model has a `name` field
                    "created_at": content.created_at,
                    "updated_at": content.updated_at,
                }
                for content in results
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.post("/banglish-to-bangla/")
async def banglish_to_bangla(
    banglish_text: str = Form(..., description="The Banglish text to be converted to Bangla")
):
    try:
        # Step 1: Set up the prompt for translation using ChatPromptTemplate
        prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessage(content="আপনি একজন অনুবাদে সহকারী। আপনার কাজ হল ব্যবহারকারীর বাংলিশ (ইংরেজি অক্ষরে লিখিত বাংলাকে) বাংলায় রুপান্তর করা। এটি সবসময় বাংলাতে করতে হবে। উদাহরণস্বরূপ:\n"
                                     "'ami valo'  → 'আমি ভালো'\n"
                                     "'tumi kemon acho' → 'তুমি কেমন আছো'\n"
                                     "'khub bhalo laglo' → 'খুব ভালো লাগলো'\n"
                                     "'ami khub happy' → 'আমি খুব খুশি'\n"
                                     "'shekhaney giye chhilo' → 'সেখানে গিয়ে ছিলো'"),
                HumanMessage(content=banglish_text)  # Add the Banglish text here
            ]
        )

        # Step 2: Use OpenAI to generate the translation
        llm = ChatOpenAI(model="gpt-4o", temperature=0.7, openai_api_key=OPENAI_API_KEY)
        
        # Get the result from the model
        result = llm.predict_messages(prompt.messages)

        # Extract the translated Bangla text
        bangla_text = result.content.strip()  # Get the response and strip any extra spaces

        # Return the translated text
        return {
            "message": "Translation successful",
            "translated_text": bangla_text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during translation: {str(e)}")

def helping_func(banglish_text: str):
    try:
        # Check if the input text is already in Bangla using a simple check (e.g., if it contains any Bengali characters)
        if any('\u0980' <= char <= '\u09FF' for char in banglish_text):  # This range includes Bengali characters
            return banglish_text  # Return as is if it's already in Bangla

        # If the text is not in Bangla, proceed with the translation from Banglish to Bangla
        prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessage(content="আপনি একজন অনুবাদে সহকারী। আপনার কাজ হল ব্যবহারকারীর বাংলিশ (ইংরেজি অক্ষরে লিখিত বাংলাকে) বাংলায় রুপান্তর করা। এটি সবসময় বাংলাতে করতে হবে। উদাহরণস্বরূপ:\n"
                                     "'ami valo'  → 'আমি ভালো'\n"
                                     "'tumi kemon acho' → 'তুমি কেমন আছো'\n"
                                     "'khub bhalo laglo' → 'খুব ভালো লাগলো'\n"
                                     "'ami khub happy' → 'আমি খুব খুশি'\n"
                                     "'shekhaney giye chhilo' → 'সেখানে গিয়ে ছিলো'"),
                HumanMessage(content=banglish_text)
            ]
        )

        # Step 2: Use OpenAI to generate the translation
        llm = ChatOpenAI(model="gpt-4", temperature=0.7, openai_api_key=OPENAI_API_KEY)
        result = llm.predict_messages(prompt.messages)

        # Extract the translated Bangla text
        bangla_text = result.content.strip()  # Get the response and strip any extra spaces
        return bangla_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during translation: {str(e)}")


pdf_storage_dir = Path(os.getcwd())  # Adjust this to your PDF storage path

@router.get("/get-pdf-content/")
async def get_pdf_content(pdf_url: str):
    # Extract the PDF file path from the URL
    file_path = pdf_storage_dir / pdf_url

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="PDF file not found")

    try:
        # Open and read the PDF file
        with open(file_path, "rb") as file:
            pdf_reader = PdfReader(file)
            text = ""

            # Iterate through each page in the PDF
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()

            if not text.strip():
                raise HTTPException(status_code=500, detail="Failed to extract text from PDF")

            return {"pdf_content": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting PDF content: {str(e)}")

@router.get("/get-pdf-links/{user_id}")
async def get_pdf_links(user_id: int, db: Session = Depends(get_db)):
    try:
        # Query the Content table to get all PDFs associated with the user_id
        user_content = db.query(Content).filter(Content.user_id == user_id).all()

        if not user_content:
            raise HTTPException(status_code=404, detail="No PDFs found for this user")

        # Extract the links of the PDFs
        pdf_links = [content.link for content in user_content]

        return {"user_id": user_id, "pdf_links": pdf_links}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving PDFs: {str(e)}")