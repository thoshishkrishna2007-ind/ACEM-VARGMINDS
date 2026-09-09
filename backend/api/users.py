from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def get_all_users():
    return {"message": "List of all users"}

@router.get("/{user_id}")
def get_user_profile(user_id: int):
    return {"message": f"Profile details for user ID: {user_id}"}

@router.put("/{user_id}")
def update_user_profile(user_id: int):
    return {"message": f"Updated profile for user ID: {user_id}"}