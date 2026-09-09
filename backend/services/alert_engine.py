class AlertEngine:
    @staticmethod
    def evaluate_weather_conditions(temperature: float, humidity: float, location: str):
        # Threshold conditions check chesi alert generate cheyadam
        if temperature > 42.0:
            return {"trigger_alert": True, "severity": "High", "message": f"Extreme heatwave warning for {location}!"}
        return {"trigger_alert": False, "severity": "Normal", "message": "Conditions are safe."}