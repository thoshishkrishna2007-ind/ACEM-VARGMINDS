from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user, require_admin
from models.alert import Alert
from models.database import get_db
from models.user import User
from schemas import AlertCreateRequest

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/")
def get_active_alerts(location: str = None, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    target = location or current_user.location
    query = db.query(Alert).filter(Alert.is_active.is_(True))
    if target:
        query = query.filter(Alert.location == target)
    return [{"id": item.id, "title": item.title, "description": item.description, "location": item.location, "severity": item.severity, "is_read": item.is_read, "created_at": item.created_at} for item in query.order_by(Alert.created_at.desc()).all()]

@router.post("/create")
def create_custom_alert(payload: AlertCreateRequest, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    alert = Alert(title=payload.title, description=payload.description, location=payload.location, severity=payload.severity.upper(), alert_type="manual")
    db.add(alert); db.commit(); db.refresh(alert)
    return {"id": alert.id, "message": "Alert created successfully"}


@router.post("/{alert_id}/read")
def mark_alert_read(alert_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = db.get(Alert, alert_id)
    if alert and (current_user.role == "admin" or alert.location == current_user.location):
        alert.is_read = True; db.commit()
    return {"message": "Alert updated"}