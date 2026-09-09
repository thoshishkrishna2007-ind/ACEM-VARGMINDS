from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from models.database import get_db
from models.alert import Alert
from models.user import User, UserPreference
from models.weather import WeatherLog
from services.ai_service import AIService
from services.alert_engine import AlertEngine
from services.open_meteo import OpenMeteoService

router = APIRouter(prefix="/weather", tags=["Weather Analysis"])

@router.get("/current")
def get_current_weather(location: str = Query(..., min_length=2), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    coordinates = OpenMeteoService.geocode_location(location)
    if coordinates.get("error"):
        raise HTTPException(status_code=502, detail=coordinates["error"])
    raw = OpenMeteoService.get_weather_data(coordinates["latitude"], coordinates["longitude"])
    if raw.get("error"):
        raise HTTPException(status_code=502, detail=raw["error"])
    current = raw.get("current_weather", {})
    weather = {"location": coordinates["name"], "latitude": coordinates["latitude"], "longitude": coordinates["longitude"], "temperature": current.get("temperature"), "wind_speed": current.get("windspeed"), "weather_code": current.get("weathercode"), "time": current.get("time"), "raw": raw}
    db.add(WeatherLog(location=coordinates["name"], latitude=coordinates["latitude"], longitude=coordinates["longitude"], temperature=current.get("temperature"), wind_speed=current.get("windspeed"), condition=str(current.get("weathercode"))))
    alert = AlertEngine.evaluate_weather_conditions(current.get("temperature", 0), 0, coordinates["name"], 0, current.get("windspeed", 0))
    preferences = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if preferences and (not preferences.notification_enabled or (current.get("temperature", 0) >= 38 and not preferences.temperature_alert) or (current.get("windspeed", 0) >= 30 and not preferences.wind_alert)):
        alert["trigger_alert"] = False
    if alert["trigger_alert"]:
        existing = db.query(Alert).filter(Alert.location == coordinates["name"], Alert.title == alert["title"], Alert.is_active.is_(True)).first()
        if not existing:
            db.add(Alert(title=alert["title"], description=alert["message"], location=coordinates["name"], severity=alert["severity"], alert_type="weather"))
    db.commit()
    return {"weather": weather, "alert": alert}

@router.post("/ai-analysis")
def analyze_weather_with_ai(location: str = Query(..., min_length=2), current_user: User = Depends(get_current_user)):
    coordinates = OpenMeteoService.geocode_location(location)
    if coordinates.get("error"):
        raise HTTPException(status_code=502, detail=coordinates["error"])
    raw = OpenMeteoService.get_weather_data(coordinates["latitude"], coordinates["longitude"])
    if raw.get("error"):
        raise HTTPException(status_code=502, detail=raw["error"])
    profile = {"designation": current_user.designation, "location": current_user.location}
    return {"location": coordinates["name"], "ai_insight": AIService.generate_weather_insight(coordinates["name"], raw, profile)}