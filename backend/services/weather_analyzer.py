from services.open_meteo import OpenMeteoService
from services.ai_service import AIService
from services.alert_engine import AlertEngine

class WeatherAnalyzer:
    @staticmethod
    def process_location_weather(lat: float, lon: float, location_name: str):
        # 1. Fetch live data
        raw_weather = OpenMeteoService.get_weather_data(lat, lon)
        
        # 2. Generate AI insights
        if raw_weather.get("error"):
            return {"location": location_name, "error": raw_weather["error"]}
        current = raw_weather.get("current_weather", {})
        alert = AlertEngine.evaluate_weather_conditions(
            current.get("temperature", 0),
            current.get("relativehumidity_2m", 0),
            location_name,
            current.get("precipitation", 0),
            current.get("windspeed", 0),
        )
        ai_insight = AIService.generate_weather_insight(location_name, raw_weather)
        
        return {
            "location": location_name,
            "raw_data": raw_weather,
            "ai_insights": ai_insight
            ,"alert": alert
        }