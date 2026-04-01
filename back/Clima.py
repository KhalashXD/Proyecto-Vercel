import requests
import pandas as pd
from FWIFunctions import calcFWI
from datetime import datetime, timedelta
month = datetime.now().month
df = pd.read_csv('weather.csv')
last_row = df.iloc[-1]


def is_around_noon():
    # Get the current time
    now = datetime.now().time()

    # Define the target time (noon)
    target_time = datetime.strptime("12:00:00", "%H:%M:%S").time()

    # Define the margin (±30 seconds)
    margin = timedelta(seconds=30)

    # Check if the current time is within the margin of noon
    return abs((datetime.combine(datetime.today(), now) - datetime.combine(datetime.today(),
                                                                           target_time)).total_seconds()) <= margin.total_seconds()


def get_climate_data(lat, lon):
    api_key = "80d6e22b7fb0ce529e0059106f7e3099"
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"]
        idx = int((data["wind"]["deg"] + 11.25) % 360 / 22.5)
        wind_dir = directions[idx]
        fwi, ffmc, dmc, dc, score = calcFWI(month,data["main"]["temp"],data["main"]["humidity"],data["wind"]["speed"]*3.6,data["rain"].get("1h", 0) if "rain" in data else 0,last_row['ffmc'],last_row['dmc'],last_row['dc'],lat)
        if is_around_noon():
            new_data = {'fwi': fwi, 'ffmc': ffmc, 'dmc': dmc, 'dc': dc}
            df = pd.DataFrame([new_data])
            df.to_csv('weather.csv', mode='a', index=False, header=False)
        return {
            "temperature": round(data["main"]["temp"],1),
            "humidity": data["main"]["humidity"],
            "weather": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"],
            "wind_speed": round(data["wind"]["speed"]*3.6, 1),
            "wind_dir": wind_dir,
            "precipitation": data["rain"].get("1h", 0) if "rain" in data else 0,
            "FWI": round(fwi,1),
            "FWI_score": score
        }
    else:
        return f"Error: {response.status_code}, {response.text}"