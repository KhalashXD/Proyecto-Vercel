import math
from typing import Any, Dict

import requests


DEFAULT_LATITUDE = -33.4489
DEFAULT_LONGITUDE = -70.6693


WEATHER_CODES = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos violentos",
    95: "Tormenta",
}


def _wind_direction(degrees: float) -> str:
    directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
    index = round(degrees / 45) % len(directions)
    return directions[index]


def _fire_weather_score(
    temperature: float,
    humidity: float,
    wind_speed: float,
    precipitation: float,
) -> Dict[str, Any]:
    dryness = max(0, 100 - humidity) / 100
    heat = max(0, temperature - 18) / 20
    wind = min(wind_speed / 40, 1.5)
    rain_penalty = min(precipitation * 0.4, 2)
    score = max(0, min(5, (dryness * 2.2) + heat + wind - rain_penalty))

    if score >= 4:
        label = "Alto"
    elif score >= 2.5:
        label = "Medio"
    else:
        label = "Bajo"

    return {"value": round(score, 1), "label": label}


def obtener_clima_actual(
    latitude: float = DEFAULT_LATITUDE,
    longitude: float = DEFAULT_LONGITUDE,
) -> Dict[str, Any]:
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,relative_humidity_2m,precipitation,"
            "weather_code,wind_speed_10m,wind_direction_10m"
        ),
        "timezone": "America/Santiago",
    }

    try:
        response = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params=params,
            timeout=10,
        )
        response.raise_for_status()
    except requests.RequestException as error:
        return {
            "source": "Open-Meteo",
            "latitude": latitude,
            "longitude": longitude,
            "condition": "No disponible",
            "temperature": 0,
            "humidity": 0,
            "wind_speed": 0,
            "wind_dir": "",
            "precipitation": 0,
            "FWI": "N/D",
            "FWI_score": "Sin datos",
            "updated_at": None,
            "is_valid": False,
            "error": str(error),
        }

    data = response.json()
    current = data.get("current", {})

    temperature = float(current.get("temperature_2m", 0))
    humidity = float(current.get("relative_humidity_2m", 0))
    wind_speed = float(current.get("wind_speed_10m", 0))
    wind_degrees = float(current.get("wind_direction_10m", 0))
    precipitation = float(current.get("precipitation", 0))
    weather_code = int(current.get("weather_code", 0))
    fire_score = _fire_weather_score(
        temperature=temperature,
        humidity=humidity,
        wind_speed=wind_speed,
        precipitation=precipitation,
    )

    return {
        "source": "Open-Meteo",
        "latitude": latitude,
        "longitude": longitude,
        "condition": WEATHER_CODES.get(weather_code, "Sin clasificar"),
        "weather_code": weather_code,
        "temperature": round(temperature, 1),
        "humidity": round(humidity),
        "wind_speed": round(wind_speed, 1),
        "wind_dir": _wind_direction(wind_degrees),
        "wind_degrees": round(wind_degrees),
        "precipitation": round(precipitation, 1),
        "FWI": fire_score["value"],
        "FWI_score": fire_score["label"],
        "updated_at": current.get("time"),
        "is_valid": all(
            math.isfinite(value)
            for value in [temperature, humidity, wind_speed, precipitation]
        ),
    }
