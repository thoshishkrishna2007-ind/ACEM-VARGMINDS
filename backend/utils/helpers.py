from datetime import datetime

def format_response(status: str, message: str, data: dict = None):
    """API responses anitini oketa standard format loki marusthundi"""
    response = {
        "status": status,
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    if data:
        response["data"] = data
    return response

def sanitize_location_name(location: str) -> str:
    """User ichina location name lo extra spaces unte clean chesthundi"""
    return location.strip().title()