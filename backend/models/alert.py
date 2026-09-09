from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from models.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True)
    description = Column(String(255))
    location = Column(String(100), index=True)
    severity = Column(String(50)) # e.g., High, Medium, Low
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)