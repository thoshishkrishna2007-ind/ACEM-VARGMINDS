from fastapi import APIRouter

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/")
def get_active_alerts(location: str = None):
    # Location base chesukuni active alerts iche logic
    if location:
        return {"message": f"Active alerts for {location}"}
    return {"message": "List of all active national/state level alerts"}

@router.post("/create")
def create_custom_alert():
    # User set cheskune custom threshold alerts (e.g., Temp > 40°C)
    return {"message": "Custom alert created successfully"}