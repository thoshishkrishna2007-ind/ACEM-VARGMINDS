import requests

class OpenMeteoService:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    @staticmethod
    def get_weather_data(latitude: float, longitude: float):
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current_weather": True
        }
        try:
            response = requests.get(OpenMeteoService.BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as exc:
            return {"error": "Weather service is temporarily unavailable", "detail": str(exc)}

    @staticmethod
    def geocode_location(location: str):
        try:
            response = requests.get("https://geocoding-api.open-meteo.com/v1/search", params={"name": location, "count": 1, "language": "en", "format": "json"}, timeout=10)
            response.raise_for_status()
            results = response.json().get("results", [])
            if not results:
                return {"error": "Location not found"}
            result = results[0]
            return {"name": result.get("name", location), "latitude": result["latitude"], "longitude": result["longitude"]}
        except requests.RequestException as exc:
            return {"error": "Location service is temporarily unavailable", "detail": str(exc)}