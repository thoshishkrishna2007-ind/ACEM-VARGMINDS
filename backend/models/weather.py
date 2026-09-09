from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from models.database import Base

class WeatherLog(Base):
    __tablename__ = "weather_logs"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(100), index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    temperature = Column(Float)
    humidity = Column(Float)
    precipitation = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    condition = Column(String(100))
    recorded_at = Column(DateTime, default=datetime.utcnow)