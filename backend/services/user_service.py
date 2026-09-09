class UserService:
    @staticmethod
    def create_user_logic(db_session, user_data):
        # Database lo user ni save chese logic ikkada untundi
        return {"message": "User registered in database successfully", "username": user_data.get("username")}

    @staticmethod
    def get_user_by_email(db_session, email: str):
        # Email dwara user ni search chese logic
        return None