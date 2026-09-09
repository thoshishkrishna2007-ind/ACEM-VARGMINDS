from fastapi import HTTPException, status
from auth.security import verify_password

# Testing kosam chinna dummy database 
fake_users_db = {
    "testuser@gmail.com": {
        "username": "testuser",
        "email": "testuser@gmail.com",
        "hashed_password": "hashed_secret123",
        "role": "user",
        "disabled": False,
    }
}

def authenticate_user(email: str, password: str):
    user = fake_users_db.get(email)
    
    # User email lekapoyina, password match avvakapoyina False return chestam
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
        
    return user