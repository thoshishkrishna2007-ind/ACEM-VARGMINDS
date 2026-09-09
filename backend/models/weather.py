from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from models.database import Base

class WeatherLog(Base):
    __tablename__ = "weather_logs"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(100), index=True)
    temperature = Column(Float)
    humidity = Column(Float)
    condition = Column(String(100))
    recorded_at = Column(DateTime, default=datetime.utcnow)