class NotificationService:
    @staticmethod
    def send_push_notification(user_id: int, message: str):
        # User mobile/web ki notification push chese logic
        return {"status": "sent", "user_id": user_id, "notification": message}