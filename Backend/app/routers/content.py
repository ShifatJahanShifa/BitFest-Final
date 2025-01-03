from fastapi import APIRouter, HTTPException, Form, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from sqlalchemy import or_
from reportlab.pdfgen import canvas  # For PDF generation
from langchain_community.chat_models import ChatOpenAI  # Updated import
from langchain.prompts import ChatPromptTemplate
from langchain.schema import SystemMessage, HumanMessage
from dotenv import load_dotenv
import os
import uuid

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

        # Get the current working directory (CWD) where the script is executed
        cwd = Path(os.getcwd())

        # Define the path for saving the PDFs relative to the CWD
        file_path = cwd / "pdfs" / unique_filename
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
        # Store the relative file path
        relative_file_path = str(file_path.relative_to(cwd))  # Get the relative path from the current working directory

        new_content = Content(
            user_id=user_id,
            link=relative_file_path,  # Save the relative file path here
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
                "link": relative_file_path,  # Return the relative path to the user
                "public": new_content.public
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



@router.put("/update/{content_id}")
async def update_content(
    content_id: int,
    title: str = Form(...),
    caption: str = Form(...),
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
        content.title = title
        content.caption = caption
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
            # Filter by content's title
            results = db.query(Content).filter(
                Content.title.ilike(f"%{search_query}%"),
                Content.public == True  # Only public contents
            ).all()
        else:
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