from fastapi import APIRouter

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/")
def get_user_notifications(user_id: int):
    # User ki vachina notifications history
    return {"message": f"Recent notifications for user ID: {user_id}"}

@router.post("/send")
def send_notification():
    # Email leda push notification pampించే logic
    return {"message": "Notification sent successfully"}