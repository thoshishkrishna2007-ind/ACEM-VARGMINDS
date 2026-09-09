from fastapi import APIRouter

# tags=["Auth"] ani isthe Swagger UI lo neat ga group avthayi
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
def register_user():
    # Database lo user ni create chese logic ikkada vastundi
    return {"message": "User signup successful (dummy response)"}

@router.post("/login")
def login_user():
    # Token generate chese logic ikkada vastundi
    return {"message": "User login successful. Token will be sent here."}