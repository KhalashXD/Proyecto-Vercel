import React, { useState } from "react";
import "./LoginSignup.css";
import Navbar from './Navbar';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();

    try {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      localStorage.setItem("userDisplayName", capitalizedName);
      localStorage.setItem("userEmail", email);

      alert("Cuenta creada. Revisa tu correo y verifica tu email antes de activar el SMS.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error al registrar usuario.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-signin">
        <section className="wrapper2">
          <div className="heading">
            <h1 className="text text-large"><strong>Registrar</strong></h1>
          </div>

          <form onSubmit={signUp}>
            <div className="input-control">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-control">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-control">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <button type="submit" className="input-submit">Submit</button>
          </form>
        </section>
      </div>
    </>
  );
};

export default SignUp;