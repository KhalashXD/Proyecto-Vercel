import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; 


function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="navbar-brand">
        <img src="/logo.png" alt="Logo" />
        <span className="navbar-text">Phoenix S.O.S</span>
      </div>
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
        
        
        <div className="navbar-images ml-auto">
          <img src="/Escudo2.png" alt="Escudo 2" />
          <img src="/Escudo1.png" alt="Escudo 1" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
