from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth.security import create_access_token, get_password_hash, verify_password
from models.database import get_db
from models.user import User, UserPreference
from schemas import LoginRequest, RegisterRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(
        name=payload.full_name,
        username=payload.email.split("@", 1)[0],
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        designation=payload.designation,
        location=payload.location,
        role="user",
    )
    db.add(user)
    db.flush()
    db.add(UserPreference(user_id=user.id))
    db.commit()
    db.refresh(user)
    return {"message": "User signup successful", "user": {"id": user.id, "name": user.name, "email": user.email}}

@router.post("/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "designation": user.designation, "location": user.location}}