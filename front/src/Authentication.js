import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import './Navbar.css';

const Authentication = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const listenAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);
      } else {
        setAuthenticatedUser(null);
      }
    });

    // Clean up the subscription on unmount
    return () => listenAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fire-risk');
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching fire risk data:', error);
      }
    };

    fetchData(); // Fetch initially
    const intervalId = setInterval(fetchData, 60000); // Fetch every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("user signed out");
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <Link className="navbar-brand" to="/">
        <img src="/logo.png" alt="Logo" />
        Phoenix S.O.S
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        {authenticatedUser == null ? (
          <>
            <Nav.Link href="/" style={{ fontFamily: 'Arial', fontSize: '1.2rem' }}>Login</Nav.Link>
            <Nav.Link href="/signup" style={{ fontFamily: 'Arial', fontSize: '1.2rem' }}>Sign Up</Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link href="/Despacho" style={{ fontFamily: 'Arial', fontSize: '1.2rem' }}>Despacho</Nav.Link>
            <Nav.Link href="/Historial" style={{ fontFamily: 'Arial', fontSize: '1.2rem' }}>Historial</Nav.Link>
            <Nav.Link href="/Emergencias" style={{ fontFamily: 'Arial', fontSize: '1.2rem' }}>Emergencias</Nav.Link>
            <Nav.Link href="/" onClick={userSignOut} style={{ fontFamily: 'Arial', fontSize: '1.2rem' }}>Salir</Nav.Link>
          </>
        )}
      </div>

      <div className="navbar-weather ml-auto">
        {weatherData ? (
          <div className="weather-info">
            <span>Condición: {weatherData.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt="Weather Icon"
                className="weather-icon"
              />
            )}</span>
            <span>Temperatura: {weatherData.temperature}°C  </span>
            <span>Humedad: {weatherData.humidity}%  </span>
            <span>Viento: {weatherData.wind_speed} km/h {weatherData.wind_dir}  </span>
            <span>Lluvia: {weatherData.precipitation}mm </span>
            <span>IPO: {weatherData.FWI} {weatherData.FWI_score}  </span>
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
