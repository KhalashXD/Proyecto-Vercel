import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Despacho from "./pages/Despacho";
import ExpandingSection from "./pages/Prueba";
import Emergencias from "./pages/Emergencias";
import Historial from "./pages/Historial";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EnrollMFA from "./pages/EnrollMFA";

import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/Despacho" element={<Despacho />} />
        <Route path="/Emergencias" element={<Emergencias />} />
        <Route path="/Historial" element={<Historial />} />

        <Route path="/Prueba" element={<ExpandingSection />} />
        <Route path="/emergencia/:id" element={<ExpandingSection />} />

        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/activar-sms" element={<EnrollMFA />} />
      </Routes>
    </Router>
  );
};

export default App;