import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Despacho from './Despacho';
import ExpandingSection from './Prueba';
import Emergencias from './Emergencias';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Historial from './Historial';
import Login from './Login';
import SignUp from './SignUp';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import EnrollMFA from "./EnrollMFA";


function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticatedUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
          <Route path="/Despacho" element={<Despacho />} />
          <Route path="/Emergencias" element={<Emergencias />} />
          <Route path="/Historial" element={<Historial />} />
          <Route path="/Prueba" element={<ExpandingSection />} />
          <Route path="/emergencia/:id" element={<ExpandingSection />} />
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/activar-sms" element={<EnrollMFA />} />
      </Routes>
      
    </Router>
  );
}

export default App;