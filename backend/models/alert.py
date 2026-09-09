from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from datetime import datetime
from models.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(50), default="weather", nullable=False)
    title = Column(String(150), index=True, nullable=False)
    description = Column(String(1000))
    ai_message = Column(String(2000), nullable=True)
    location = Column(String(100), index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    severity = Column(String(20), default="LOW", nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)