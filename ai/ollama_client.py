import json
import os
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv


# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
PROMPT_FILE = BASE_DIR / "prompts" / "weather_prompt.txt"

load_dotenv(Path(__file__).resolve().parent.parent / "backend" / ".env")

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")

REQUEST_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "60"))


# ---------------------------------------------------------
# Prompt Loader
# ---------------------------------------------------------

def load_weather_prompt() -> str:
    """
    Load the weather analysis prompt from weather_prompt.txt.
    """

    if not PROMPT_FILE.exists():
        raise FileNotFoundError(
            f"Weather prompt file not found: {PROMPT_FILE}"
        )

    return PROMPT_FILE.read_text(encoding="utf-8")


# ---------------------------------------------------------
# Prompt Builder
# ---------------------------------------------------------

def build_weather_prompt(
    weather_data: dict[str, Any],
    user_profile: dict[str, Any] | None = None,
    location: str = "Unknown",
    current_time: str = "Unknown",
) -> str:
    """
    Replace template placeholders with actual data.
    """

    prompt = load_weather_prompt()

    prompt = prompt.replace(
        "{{WEATHER_DATA}}",
        json.dumps(weather_data, ensure_ascii=False, indent=2),
    )

    prompt = prompt.replace(
        "{{USER_PROFILE}}",
        json.dumps(
            user_profile or {},
            ensure_ascii=False,
            indent=2,
        ),
    )

    prompt = prompt.replace(
        "{{LOCATION}}",
        location,
    )

    prompt = prompt.replace(
        "{{CURRENT_TIME}}",
        current_time,
    )

    return prompt


# ---------------------------------------------------------
# JSON Parser
# ---------------------------------------------------------

def parse_ai_response(response_text: str) -> dict[str, Any]:
    """
    Convert Ollama's response into a Python dictionary.

    Handles cases where the model accidentally returns
    Markdown code fences around JSON.
    """

    cleaned = response_text.strip()

    # Remove Markdown code fences if present
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()

        if lines and lines[0].startswith("```"):
            lines = lines[1:]

        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]

        cleaned = "\n".join(lines).strip()

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Ollama returned invalid JSON: {response_text}"
        ) from exc

    if not isinstance(result, dict):
        raise ValueError("AI response must be a JSON object.")

    return result


# ---------------------------------------------------------
# Ollama Client
# ---------------------------------------------------------

class OllamaClient:
    """
    Client for communicating with a local Ollama server.
    """

    def __init__(
        self,
        base_url: str = OLLAMA_URL,
        model: str = OLLAMA_MODEL,
        timeout: int = REQUEST_TIMEOUT,
    ):
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout

    def is_available(self) -> bool:
        """
        Check whether Ollama server is running.
        """

        try:
            response = requests.get(
                f"{self.base_url}/api/tags",
                timeout=5,
            )

            return response.ok

        except requests.RequestException:
            return False

    def analyze_weather(
        self,
        weather_data: dict[str, Any],
        user_profile: dict[str, Any] | None = None,
        location: str = "Unknown",
        current_time: str = "Unknown",
    ) -> dict[str, Any]:
        """
        Analyze weather data using Ollama.
        """

        prompt = build_weather_prompt(
            weather_data=weather_data,
            user_profile=user_profile,
            location=location,
            current_time=current_time,
        )

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a reliable weather risk analysis engine. "
                        "Follow the provided instructions exactly."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.1,
            },
        }

        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=self.timeout,
            )

            response.raise_for_status()

        except requests.ConnectionError as exc:
            raise ConnectionError(
                "Cannot connect to Ollama. "
                "Make sure Ollama is running."
            ) from exc

        except requests.Timeout as exc:
            raise TimeoutError(
                f"Ollama request timed out after {self.timeout} seconds."
            ) from exc

        except requests.RequestException as exc:
            raise RuntimeError(
                f"Ollama request failed: {exc}"
            ) from exc

        try:
            data = response.json()
        except ValueError as exc:
            raise ValueError(
                "Ollama returned an invalid HTTP response."
            ) from exc

        ai_message = data.get("message", {})
        ai_content = ai_message.get("content")

        if not ai_content:
            raise ValueError(
                "Ollama response did not contain AI content."
            )

        return parse_ai_response(ai_content)


# ---------------------------------------------------------
# Default Client
# ---------------------------------------------------------

ollama_client = OllamaClient()


# ---------------------------------------------------------
# Simple Helper Function
# ---------------------------------------------------------

def analyze_weather(
    weather_data: dict[str, Any],
    user_profile: dict[str, Any] | None = None,
    location: str = "Unknown",
    current_time: str = "Unknown",
) -> dict[str, Any]:
    """
    Convenient function for backend services.
    """

    return ollama_client.analyze_weather(
        weather_data=weather_data,
        user_profile=user_profile,
        location=location,
        current_time=current_time,
    )