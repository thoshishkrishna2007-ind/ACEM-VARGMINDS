import os
from datetime import datetime, timedelta

# .env nunchi secret key testunnam
SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_for_jwt_auth")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_password_hash(password: str) -> str:
    # Dummy hash for now. Real world lo 'passlib' library vadatham.
    return f"hashed_{password}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # User icchina password, DB lo unna password match ayyayo ledo checking
    return f"hashed_{plain_password}" == hashed_password

def create_access_token(data: dict) -> str:
    # Dummy token generation. Real app lo 'PyJWT' library vadtham
    expire_time = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    user_identifier = data.get("sub", "unknown")
    return f"fake-jwt-token-for-{user_identifier}-expires-at-{expire_time.timestamp()}"