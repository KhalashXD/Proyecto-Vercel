import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Navbar.css";

interface WeatherData {
  icon?: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_dir: string;
  precipitation: number;
  FWI: number | string;
  FWI_score: string;
}

const Authentication: React.FC = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const listenAuth = onAuthStateChanged(auth, (user) => {
      setAuthenticatedUser(user || null);
    });

    return () => listenAuth();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async (): Promise<void> => {
      try {
        const response = await fetch("/api/fire-risk");
        const data: WeatherData = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching fire risk data:", error);
      }
    };

    fetchWeatherData();

    const intervalId = window.setInterval(fetchWeatherData, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  const userSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <Link className="navbar-brand" to="/">
        <img src="/logo.png" alt="Logo Phoenix S.O.S" />
        <span className="navbar-text">Phoenix S.O.S</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Abrir navegación"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav">
          {authenticatedUser == null ? (
            <>
              <Link className="nav-link" to="/">
                Login
              </Link>

              <Link className="nav-link" to="/signup">
                Registro
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/Despacho">
                Despacho
              </Link>

              <Link className="nav-link" to="/Historial">
                Historial
              </Link>

              <Link className="nav-link" to="/EmergenciasActivas">
                Emergencias
              </Link>

              <button
                type="button"
                className="nav-link nav-link-button"
                onClick={userSignOut}
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>

      <div className="navbar-weather">
        {weatherData ? (
          <div className="weather-info">
            <span>
              Condición:{" "}
              {weatherData.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                  alt="Ícono clima"
                  className="weather-icon"
                />
              )}
            </span>

            <span>Temperatura: {weatherData.temperature}°C</span>
            <span>Humedad: {weatherData.humidity}%</span>
            <span>
              Viento: {weatherData.wind_speed} km/h {weatherData.wind_dir}
            </span>
            <span>Lluvia: {weatherData.precipitation} mm</span>
            <span>
              IPO: {weatherData.FWI} {weatherData.FWI_score}
            </span>
          </div>
        ) : (
          <span>Cargando datos climáticos...</span>
        )}
      </div>

      <div className="navbar-images">
        <img src="/Escudo2.png" alt="Escudo 2" />
        <img src="/Escudo1.png" alt="Escudo 1" />
      </div>
    </nav>
  );
};

export default Authentication;