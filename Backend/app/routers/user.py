from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from .. import models, tables, utils, oauth2
from pathlib import Path
import os
from ..database import get_db
from typing import List


router = APIRouter(
    prefix="/user",
    tags=["User"]
)

# Path to save uploaded profile pictures
PROFILE_PICTURE_DIR = Path(os.getenv("PROFILE_PICTURE_DIR", "uploads/profiles"))

# Update User Endpoint
@router.put("/update")
async def update_user(
    name: str
    
     = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    pfp: UploadFile = File(None),  # Optional profile picture upload
    db: Session = Depends(get_db),
    current_user: dict = Depends(oauth2.get_current_user)  # user_id will come from token
):
    user_id = current_user["user_id"]  # Extract user_id from the token

    # Fetch the user from the database
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's fields
    user.name = name
    user.email = email
    user.password = utils.hash_password(password)  # Use a utility function to hash the password

    # Handle Profile Picture Upload (optional)
    if pfp:
        # Generate a unique filename for the profile picture
        pfp_filename = f"{user_id}_{pfp.filename}"
        pfp_path = PROFILE_PICTURE_DIR / pfp_filename

        # Create the directory if it doesn't exist
        PROFILE_PICTURE_DIR.mkdir(parents=True, exist_ok=True)

        # Save the profile picture
        with open(pfp_path, "wb") as f:
            f.write(await pfp.read())

        # Update the pfp field with the file path
        user.pfp = str(pfp_path)

    # Commit the changes to the database
    db.commit()
    db.refresh(user)

    return {
        "message": "User updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "pfp": user.pfp  # Return the profile picture path
        }
    }

@router.get("/all", response_model=List[models.UserModel])
async def get_all_users(
    db: Session = Depends(get_db),
    current_user: dict = Depends(oauth2.get_current_user)  # You may want to restrict this to admins only
):
    # Optionally, you can restrict access to admin users only
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="You do not have permission to view all users")

    users = db.query(models.User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")

    return users



