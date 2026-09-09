from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent / ".env")

# Importing all routers
from api import auth, users, weather, alerts, notifications, admin

# Importing database engine and Base to create tables
from models.database import engine
from models import role, user, alert, notification, weather as weather_model
from models.database import Base

# Automatically create database tables in MySQL if not exist
Base.metadata.create_all(bind=engine)

# Initialize FastAPI App
app = FastAPI(
    title="ACEM-VARGMINDS Backend",
    description="Backend API for Smart India Hackathon Project",
    version="1.0.0"
)
app.add_middleware(CORSMiddleware, allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Connect API routes
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(weather.router)
app.include_router(alerts.router)
app.include_router(notifications.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Welcome to ACEM-VARGMINDS API! Backend is live."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)