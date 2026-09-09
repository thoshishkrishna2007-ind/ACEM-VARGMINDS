import sys
from pathlib import Path

# Root folder nunchi 'ai' module ni import chesukotaniki path add chestunnam
sys.path.append(str(Path(__file__).resolve().parents[2]))

from ai.ollama_client import analyze_weather

class AIService:
    @staticmethod
    def generate_weather_insight(location: str, weather_data: dict, user_profile: dict | None = None) -> dict:
        try:
            result = analyze_weather(weather_data, user_profile, location)
            return result
        except (ConnectionError, TimeoutError, RuntimeError, ValueError, OSError):
            return {"risk_level": "LOW", "headline": "Weather update", "summary": "Live weather is available; AI analysis is temporarily unavailable.", "alert_message": "Review the current conditions and local official guidance.", "recommended_actions": [], "confidence": 0.0}