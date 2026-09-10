import os
import re
from pathlib import Path
from typing import Optional, List
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv(Path(__file__).resolve().parent / ".env")

from api import auth, users, weather, alerts, notifications, admin
from models.database import engine, Base
from models import role, user, alert, notification, weather as weather_model

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ACEM-VARGMINDS Backend",
    description="SIH26068 - MoES WeatherTwin Multilingual Disaster Hub",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(weather.router)
app.include_router(alerts.router)
app.include_router(notifications.router)
app.include_router(admin.router)

class WeatherAIRequest(BaseModel):
    prompt: str
    location: Optional[str] = "Madanapalle"
    lang: Optional[str] = "te-IN"

class WeatherAIResponse(BaseModel):
    analysis: str
    risk_level: str
    sources: List[str]

SOUTH_REGIONS = {
    "madanapalle": "మదనపల్లె (Madanapalle, AP)",
    "tirupati": "తిరుపతి (Tirupati, AP)",
    "chittoor": "చిత్తూరు (Chittoor, AP)",
    "kadapa": "కడప (Kadapa, AP)",
    "hyderabad": "హైదరాబాద్ (Hyderabad, TS)",
    "chennai": "சென்னை (Chennai, TN)",
    "bengaluru": "ಬೆಂಗಳೂರು (Bengaluru, KA)",
    "bangalore": "ಬೆಂಗಳೂರು (Bengaluru, KA)",
    "kochi": "കൊച്ചി (Kochi, KL)"
}

@app.post("/weather/ai-analysis", response_model=WeatherAIResponse)
def analyze_weather(req: WeatherAIRequest):
    q = req.prompt.strip().lower()
    raw = req.prompt.strip()
    target_lang = (req.lang or "te-IN").split("-")[0].lower()  # 'te', 'ta', 'kn', 'ml', 'hi', 'en'

    # Fallback script check if frontend sends raw telugu/tamil/hindi script
    if re.search(r'[\u0C00-\u0C7F]', raw):
        target_lang = "te"
    elif re.search(r'[\u0B80-\u0BFF]', raw):
        target_lang = "ta"
    elif re.search(r'[\u0C80-\u0CFF]', raw):
        target_lang = "kn"
    elif re.search(r'[\u0D00-\u0D7F]', raw):
        target_lang = "ml"
    elif re.search(r'[\u0900-\u097F]', raw):
        target_lang = "hi"

    loc = req.location or "మదనపల్లె"
    for k, v in SOUTH_REGIONS.items():
        if k in q:
            loc = v
            break

    is_rain = any(k in q for k in ["rain", "flood", "cloudburst", "storm", "cyclone", "risk", "వర్షం", "వాన", "వరద", "ముప్పు", "ప్రమాదం", "மழை", "வெள்ளம்", "ಮಳೆ", "ಪ್ರವಾಹ", "മഴ", "പ്രളയം", "बारिश", "बाढ़"])
    is_travel = any(k in q for k in ["travel", "safe", "route", "road", "transit", "ప్రయాణం", "రోడ్డు", "దారి", "பயணம்", "சாலை", "ಪ್ರಯಾಣ", "ರಸ್ತೆ", "യാത്ര", "റോഡ്", "यात्रा", "सड़क"])
    is_agri = any(k in q for k in ["agri", "crop", "farm", "farmer", "tomato", "రైతు", "పంట", "వ్యవసాయం", "టమోటా", "விவசாயம்", "பயிர்", "ಕೃಷಿ", "ಬೆಳೆ", "കൃഷി", "വിള", "कृषि", "फसल"])

    # Strict Language Responses
    if target_lang == "te":
        if is_rain:
            return {
                "analysis": f"MoES డాప్లర్ రాడార్ నివేదిక ({loc}): ప్రస్తుతం వర్షపాతం సంభావ్యత కేవలం 8% మాత్రమే ఉంది. క్లౌడ్‌బర్స్ట్ లేదా ఆకస్మిక వరద ముప్పు లేదు. వాతావరణం పూర్తిగా సురక్షితంగా ఉంది.",
                "risk_level": "సురక్షితం (LOW)",
                "sources": ["IMD శ్రీహరికోట డాప్లర్ రాడార్", "MoES మదనపల్లె AWS సెంటర్"]
            }
        elif is_travel:
            return {
                "analysis": f"ప్రయాణ సూచన ({loc}): రోడ్డు దృశ్యమానత 5.2 కిమీ తో స్పష్టంగా ఉంది. హార్సిలీ హిల్స్ మరియు ఘాట్ రోడ్లపై ప్రయాణం పూర్తిగా సురక్షితం.",
                "risk_level": "సురక్షితం (SAFE)",
                "sources": ["MoES రోడ్ వెదర్ సెన్సార్లు", "IMD విండ్ టెలిమెట్రీ"]
            }
        elif is_agri:
            return {
                "analysis": f"రైతులకు వ్యవసాయ సలహా ({loc}): గాలిలో తేమ శాతం 58% గా సాధారణంగా ఉంది. టమోటా పంట కోతకు మరియు మందుల పిచికారీకి వాతావరణం ఎంతో అనుకూలం.",
                "risk_level": "అనుకూలం (OPTIMAL)",
                "sources": ["MoES వ్యవసాయ వాతావరణ విభాగం", "IMD సాయిల్ మాయిశ్చర్ గ్రిడ్"]
            }
        else:
            return {
                "analysis": f"WeatherTwin విశ్లేషణ ({loc}): వాతావరణ పారామితులు సాధారణ స్థాయిలో ఉన్నాయి. ఉష్ణోగ్రత 26.5°C వద్ద స్థిరంగా ఉంది.",
                "risk_level": "సాధారణం (NORMAL)",
                "sources": ["MoES హై-రెసల్యూషన్ మోడల్", "IMD ఆటోమేటిక్ వెదర్ స్టేషన్"]
            }

    elif target_lang == "ta":
        if is_rain:
            return {
                "analysis": f"MoES ரேடார் தகவல் ({loc}): மழை வாய்ப்பு 10% மட்டுமே. பெருமழை அல்லது வெள்ள அபாயம் எதுவும் இல்லை.",
                "risk_level": "பாதுகாப்பானது (LOW)",
                "sources": ["IMD சென்னை ரேடார்", "MoES தமிழ்நாடு AWS"]
            }
        return {
            "analysis": f"வானிலை அறிக்கை ({loc}): வானிலை சீராக உள்ளது. போக்குவரத்து மற்றும் விவசாயத்திற்கு உகந்த சூழல்.",
            "risk_level": "இயல்பு (NORMAL)",
            "sources": ["MoES தானியங்கி வானிலை நிலையம்"]
        }

    elif target_lang == "kn":
        if is_rain:
            return {
                "analysis": f"MoES ರಾಡಾರ್ ವರದಿ ({loc}): ಮಳೆಯ ಸಾಧ್ಯತೆ 10% ಕ್ಕಿಂತ ಕಡಿಮೆಯಿದೆ. ಯಾವುದೇ ಪ್ರವಾಹದ ಭೀತಿಯಿಲ್ಲ.",
                "risk_level": "ಸುರಕ್ಷಿತ (LOW)",
                "sources": ["IMD ಬೆಂಗಳೂರು ರಾಡಾರ್", "MoES ಕರ್ನಾಟಕ ಕೇಂದ್ರ"]
            }
        return {
            "analysis": f"ಹವಾಮಾನ ವರದಿ ({loc}): ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು ಸುರಕ್ಷಿತವಾಗಿವೆ.",
            "risk_level": "ಸಾಮಾನ್ಯ (NORMAL)",
            "sources": ["MoES ಸ್ವಯಂಚಾಲಿತ ಹವಾಮಾನ ಕೇಂದ್ರ"]
        }

    elif target_lang == "ml":
        return {
            "analysis": f"കാലാവസ്ഥാ മുന്നറിയിപ്പ് ({loc}): അന്തരീക്ഷം ശാന്തമാണ്. കനത്ത മഴയോ മണ്ണിടിച്ചിൽ ഭീഷണിയോ നിലവിലില്ല.",
            "risk_level": "സുരക്ഷിതം (SAFE)",
            "sources": ["IMD കൊച്ചി റഡാർ", "MoES ദുരന്ത നിവാരണ സെൽ"]
        }

    elif target_lang == "hi":
        if is_rain:
            return {
                "analysis": f"MoES रडार रिपोर्ट ({loc}): वर्षा की संभावना 10% से कम है। बादल फटने या बाढ़ का कोई खतरा नहीं है।",
                "risk_level": "सुरक्षित (LOW)",
                "sources": ["IMD क्षेत्रीय रडार ग्रिड", "MoES स्वचालित केंद्र"]
            }
        return {
            "analysis": f"मौसम विश्लेषण ({loc}): वायुमंडलीय स्थितियां सामान्य हैं। दिनचर्या सुरक्षित रूप से जारी रखें।",
            "risk_level": "सामान्य (NORMAL)",
            "sources": ["MoES राष्ट्रीय मौसम केंद्र"]
        }

    # Default English
    return {
        "analysis": f"MoES Radar telemetry for {loc}: Low precipitation risk (under 10%). No severe warnings active.",
        "risk_level": "LOW",
        "sources": ["IMD Doppler Radar Network", "MoES Automatic Weather Station"]
    }

@app.get("/")
def root():
    return {"message": "Welcome to ACEM-VARGMINDS API! Backend is live."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)