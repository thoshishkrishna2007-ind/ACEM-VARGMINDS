class AlertEngine:
    @staticmethod
    def evaluate_weather_conditions(temperature: float, humidity: float, location: str, precipitation: float = 0, wind_speed: float = 0):
        if temperature >= 42:
            return {"trigger_alert": True, "severity": "CRITICAL", "title": "Extreme heat warning", "message": f"Extreme heat is expected in {location}."}
        if precipitation >= 60 or wind_speed >= 50:
            return {"trigger_alert": True, "severity": "HIGH", "title": "Severe weather warning", "message": f"Hazardous weather conditions are possible in {location}."}
        if temperature >= 38 or precipitation >= 30 or wind_speed >= 30:
            return {"trigger_alert": True, "severity": "MODERATE", "title": "Weather caution", "message": f"Weather conditions may affect outdoor plans in {location}."}
        return {"trigger_alert": False, "severity": "LOW", "title": "Conditions normal", "message": "No significant weather risk detected."}