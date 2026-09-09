import sys
import os

# Root folder nunchi 'ai' module ni import chesukotaniki path add chestunnam
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Oka vela meeru 'ai/ollama_client.py' rasirunte dani ikkada import cheyochu
# Example: from ai.ollama_client import OllamaClient

class AIService:
    @staticmethod
    def generate_weather_insight(location: str, weather_data: dict) -> str:
        # Ikkada Ollama AI ki prompt pampi response thecchukune logic raastaru
        return f"AI Weather Insight for {location}: Conditions look stable based on recent data."