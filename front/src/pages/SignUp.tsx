import React, { useState } from "react";
import "../styles/LoginSignup.css";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const signUp = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const cleanName = name.trim();
      const capitalizedName =
        cleanName.length > 0
          ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
          : "";

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await sendEmailVerification(user);

      localStorage.setItem("userDisplayName", capitalizedName);
      localStorage.setItem("userEmail", email);

      alert(
        "Cuenta creada. Revisa tu correo y verifica tu email antes de activar el SMS."
      );

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
            <h1 className="text text-large">
              <strong>Registrar</strong>
            </h1>

            <p className="text text-normal">
              ¿Ya tienes cuenta?{" "}
              <span>
                <a href="/" className="text text-links">
                  Volver a Login
                </a>
              </span>
            </p>
          </div>

          <form onSubmit={signUp}>
            <div className="input-control">
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                autoComplete="name"
              />
            </div>

            <div className="input-control">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div className="input-control">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="input-submit">
              Registrar
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default SignUp;