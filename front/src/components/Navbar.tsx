import React from "react";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-custom auth-navbar">
      <div className="navbar-brand">
        <img src="/logo.png" alt="Logo Phoenix S.O.S" />
        <span className="navbar-text">Phoenix S.O.S</span>
      </div>

      <div className="navbar-images">
        <img src="/Escudo2.png" alt="Escudo 2" />
        <img src="/Escudo1.png" alt="Escudo 1" />
      </div>
    </nav>
  );
};

export default Navbar;