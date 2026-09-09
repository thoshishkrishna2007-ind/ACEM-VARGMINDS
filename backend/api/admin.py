from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.dependencies import require_admin
from models.alert import Alert
from models.database import get_db
from models.user import User

router = APIRouter(prefix="/admin", tags=["Admin panel"])

@router.get("/stats")
def get_platform_statistics(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return {"users": db.query(User).count(), "active_users": db.query(User).filter(User.is_active.is_(True)).count(), "active_alerts": db.query(Alert).filter(Alert.is_active.is_(True)).count()}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if user: user.is_active = False; db.commit()
    return {"message": f"User {user_id} deactivated"}