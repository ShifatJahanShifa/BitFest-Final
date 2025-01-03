from pydantic import BaseModel, EmailStr
from datetime import datetime
from .tables import Role
from typing import Optional, Any

class UserModel(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role

    class config:
        orm_mode = True

class LoginModel(BaseModel):
    email: EmailStr
    password: str

    class config:
        orm_mode = True

class TranslationImprovementCreate(BaseModel):
    banglish: str
    bangla: str

class TranslationImprovementUpdate(BaseModel):
    banglish: str = None
    bangla: str = None