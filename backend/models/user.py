from sqlalchemy import Boolean, Column, DateTime, Integer, String
from datetime import datetime
from models.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False)
    designation = Column(String(50), default="General User")
    location = Column(String(150), nullable=True)
    latitude = Column(String(30), nullable=True)
    longitude = Column(String(30), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True)
    notification_enabled = Column(Boolean, default=True, nullable=False)
    rain_alert = Column(Boolean, default=True, nullable=False)
    temperature_alert = Column(Boolean, default=True, nullable=False)
    wind_alert = Column(Boolean, default=True, nullable=False)