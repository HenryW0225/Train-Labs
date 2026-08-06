from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    disabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    stats = relationship("Stats", back_populates="user", cascade="all, delete-orphan")

class Stats(Base):
    __tablename__ = "stats"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    streak = Column(String, default="0")
    blocks_used = Column(JSON, default=list)

    user = relationship("User", back_populates="stats")