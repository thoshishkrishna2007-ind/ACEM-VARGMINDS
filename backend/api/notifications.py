from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user, require_admin
from models.database import get_db
from models.notification import Notification
from models.user import User

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/")
def get_user_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [{"id": item.id, "title": item.title, "message": item.message, "is_read": item.is_read, "created_at": item.created_at} for item in db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()]

@router.post("/send")
def send_notification(_: User = Depends(require_admin)):
    return {"message": "Notification delivery is available through alert creation."}