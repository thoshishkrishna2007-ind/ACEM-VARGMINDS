from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user, require_admin
from models.database import get_db
from models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "role": current_user.role, "designation": current_user.designation, "location": current_user.location}

@router.get("/")
def get_all_users(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return [{"id": user.id, "name": user.name, "email": user.email, "role": user.role, "designation": user.designation, "location": user.location} for user in db.query(User).all()]

@router.get("/{user_id}")
def get_user_profile(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        return {"detail": "User not found"}
    if current_user.id != user_id and current_user.role != "admin":
        return {"detail": "Forbidden"}
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "designation": user.designation, "location": user.location}

@router.put("/{user_id}")
def update_user_profile(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user or (current_user.id != user_id and current_user.role != "admin"):
        return {"detail": "Forbidden"}
    return {"message": f"Profile ready for update", "user_id": user.id}