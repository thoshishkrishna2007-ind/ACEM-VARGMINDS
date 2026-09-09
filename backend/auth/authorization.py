from fastapi import HTTPException, status

def check_is_admin(current_user: dict):
    # User role admin kakapothe Error istham
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You do not have Admin privileges."
        )
    return True

def check_is_active_user(current_user: dict):
    # Okavela account disable ayyunte error istham
    if current_user.get("disabled"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive or suspended user account."
        )
    return current_user