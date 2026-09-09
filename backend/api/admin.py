from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["Admin panel"])

@router.get("/stats")
def get_platform_statistics():
    # Total users, API calls, lanti stats admin ki chupinchadaniki
    return {"message": "Platform statistics overview"}

@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    # Admin okavela user ni delete cheyali anukunte
    return {"message": f"User {user_id} deleted successfully"}