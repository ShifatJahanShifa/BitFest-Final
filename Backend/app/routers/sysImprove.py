from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..tables import TranslationSystemImprovement, User
from ..oauth2 import get_current_user
from ..models import TranslationImprovementCreate, TranslationImprovementUpdate

router = APIRouter(prefix="/translation", tags=["Translation System Improvement"])

# Endpoint to create a new translation system improvement data
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_translation_data(
    banglish: str,
    bangla: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    try:
        # Create a new entry
        new_data = TranslationSystemImprovement(
            user_id=current_user["user_id"],
            banglish=banglish,
            bangla=bangla,
        )
        db.add(new_data)
        db.commit()
        db.refresh(new_data)
        return {"message": "Data added successfully", "data": new_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating data: {str(e)}")


# Endpoint to update data (Admin only)
@router.put("/{data_id}", status_code=status.HTTP_200_OK)
def update_translation_data(
    data_id: int,
    update_data: TranslationImprovementUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update data")

    data = db.query(TranslationSystemImprovement).filter(TranslationSystemImprovement.id == data_id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")

    data.banglish = update_data.banglish or data.banglish
    data.bangla = update_data.bangla or data.bangla

    db.commit()
    db.refresh(data)
    return {"message": "Data updated successfully", "data": data}


# Endpoint to delete data (Admin only)
@router.delete("/{data_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_translation_data(
    data_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete data")

    data = db.query(TranslationSystemImprovement).filter(TranslationSystemImprovement.id == data_id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")

    db.delete(data)
    db.commit()
    return {"message": "Data deleted successfully"}

@router.get("/system-improvement")
async def get_all_system_improvement_data(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve all system improvement data.
    Accessible by both users and admins.
    """
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can see data")

    try:
        data = db.query(SystemImprove).all()
        if not data:
            raise HTTPException(status_code=404, detail="No system improvement data found.")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
