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
            response = requests.get(OpenMeteoService.BASE_URL, params=params)
            if response.status_code == 200:
                return response.json()
            return {"error": "Failed to fetch weather data from external API"}
        except Exception as e:
            return {"error": str(e)}