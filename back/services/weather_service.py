import math
import os

import requests


def _wind_direction(degrees):
    directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
    index = round(degrees / 45) % 8
    return directions[index]


def _fire_weather_index(temperature, humidity, wind_speed, precipitation):
    rain_factor = max(0, 1 - (precipitation / 6))
    dryness = max(0, 100 - humidity) / 100
    heat = max(0, temperature - 10) / 25
    wind = min(wind_speed, 60) / 60
    score = round((dryness * 0.45 + heat * 0.35 + wind * 0.2) * 30 * rain_factor, 1)

    if score >= 20:
        label = "Alto"
    elif score >= 10:
        label = "Moderado"
    else:
        label = "Bajo"

    return score, label


def _open_weather_icon(weather_code):
    if weather_code in (0, 1):
        return "01d"
    if weather_code in (2, 3):
        return "03d"
    if weather_code in (45, 48):
        return "50d"
    if 51 <= weather_code <= 67 or 80 <= weather_code <= 82:
        return "10d"
    if 95 <= weather_code <= 99:
        return "11d"

    return "02d"


def obtener_datos_climaticos():
    latitude = float(os.getenv("DEFAULT_LATITUDE", "-33.0234"))
    longitude = float(os.getenv("DEFAULT_LONGITUDE", "-71.5543"))

    response = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
            "timezone": os.getenv("APP_TIMEZONE", "America/Santiago"),
        },
        timeout=15,
    )
    response.raise_for_status()

    current = response.json().get("current", {})
    temperature = float(current.get("temperature_2m", 0))
    humidity = float(current.get("relative_humidity_2m", 0))
    wind_speed = float(current.get("wind_speed_10m", 0))
    precipitation = float(current.get("precipitation", 0))
    wind_degrees = float(current.get("wind_direction_10m", 0))
    weather_code = int(current.get("weather_code", 0))
    fwi, fwi_score = _fire_weather_index(
        temperature,
        humidity,
        wind_speed,
        precipitation,
    )

    return {
        "temperature": round(temperature, 1),
        "icon": _open_weather_icon(weather_code),
        "humidity": round(humidity),
        "wind_speed": round(wind_speed, 1),
        "wind_dir": _wind_direction(wind_degrees),
        "precipitation": round(precipitation, 1),
        "FWI": fwi if not math.isnan(fwi) else 0,
        "FWI_score": fwi_score,
        "source": "Open-Meteo",
        "latitude": latitude,
        "longitude": longitude,
        "updated_at": current.get("time"),
    }
