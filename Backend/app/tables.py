from sqlalchemy import (
    Column,
    String,
    Integer,
    Enum,
    DateTime,
    Text,
    ForeignKey,
    Boolean
)
from sqlalchemy.orm import Mapped, mapped_column, declarative_base, relationship
from datetime import datetime
from enum import Enum as PyEnum

Base = declarative_base()

# Enum class for User roles
class Role(PyEnum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users_table"  # Table name

    # Primary key with auto-incrementing integer
    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # Non-nullable fields
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)

    # Profile picture link stored as a string
    pfp: Mapped[str] = mapped_column(String, nullable=True)

    # Optional bio field
    bio: Mapped[str] = mapped_column(Text, nullable=True)

    # Enum for role (user or admin)
    role: Mapped[Role] = mapped_column(Enum(Role), nullable=False, default=Role.USER)

    # Timestamp for record creation
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    chat= relationship("Chat", back_populates="user", cascade="all, delete",passive_deletes=True,)
    contents= relationship("Content", back_populates="user", cascade="all, delete",passive_deletes=True,)
    improvement_data = relationship(
        "TranslationSystemImprovement", back_populates="user", cascade="all, delete", passive_deletes=True
    )



class Chat(Base):
    __tablename__= "chat"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users_table.id", ondelete="CASCADE"), nullable=False)
    message = Column(String, nullable = False)  # The user's message
    response = Column(String, nullable = False) # The chatbot's response
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat") 


class Content(Base):
    __tablename__ = "contents"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users_table.id",ondelete="CASCADE"), nullable=False,)
    link = Column(String, nullable=False)
    title = Column(String, nullable=False)
    caption = Column(String, nullable=False)
    public = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="contents")

class TranslationSystemImprovement(Base):
    __tablename__ = "translation_system_improvement"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users_table.id", ondelete="CASCADE"), nullable=False)
    banglish = Column(String, nullable=False)
    bangla = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to user
    user = relationship("User", back_populates="improvement_data")