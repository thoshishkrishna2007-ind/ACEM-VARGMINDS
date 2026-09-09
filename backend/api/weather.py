from fastapi import APIRouter

router = APIRouter(prefix="/weather", tags=["Weather Analysis"])

@router.get("/current")
def get_current_weather(location: str):
    return {"location": location, "weather": "Sunny, 32°C"}

@router.post("/ai-analysis")
def analyze_weather_with_ai(location: str):
    # Mee ai/ollama_client.py ni ikkada connect chestam
    return {"location": location, "ai_insight": "AI generated weather insights will appear here"}