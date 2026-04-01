import React, { useState } from "react";
import "./LoginSignup.css";
import Navbar from './Navbar';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();

    
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        localStorage.setItem("userDisplayName", capitalizedName);
        localStorage.setItem("userEmail", email);

        console.log("User name:", capitalizedName);

        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="container-signin">
        <section className="wrapper2">
          <div className="heading">
            <h1 className="text text-large"><strong>Registrar</strong></h1>
            <p className="text text-normal">Ya eres un usuario? <span><a href="/login" className="text text-links">Login</a></span></p>
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
            <button type="submit" name="submit" className="input-submit" value="Sign In">Submit</button>
          </form>
        </section>
      </div>
    </>
  );
};

export default SignUp;