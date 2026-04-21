import React, { useState } from "react";
import "./LoginSignup.css";
import Navbar from "./Navbar";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  multiFactor,
  getMultiFactorResolver,
  RecaptchaVerifier,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [error, setError] = useState("");
  const [resolver, setResolver] = useState(null);
  const [verificationId, setVerificationId] = useState("");
  const [showSmsStep, setShowSmsStep] = useState(false);

  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: () => {
            console.log("reCAPTCHA resuelto");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expirado");
          },
        }
      );
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Si el usuario aún no tiene segundo factor inscrito
      if (multiFactor(user).enrolledFactors.length === 0) {
        navigate("/activar-sms");
        return;
      }

      // Si entra normal
      navigate("/Despacho");
    } catch (err) {
      console.error("Error login:", err);

      if (err.code === "auth/multi-factor-auth-required") {
        try {
          setupRecaptcha();

          const mfaResolver = getMultiFactorResolver(auth, err);
          setResolver(mfaResolver);

          const selectedHint = mfaResolver.hints[0];

          const phoneInfoOptions = {
            multiFactorHint: selectedHint,
            session: mfaResolver.session,
          };

          const phoneAuthProvider = new PhoneAuthProvider(auth);

          const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(
            phoneInfoOptions,
            window.recaptchaVerifier
          );

          setVerificationId(newVerificationId);
          setShowSmsStep(true);
        } catch (mfaErr) {
          console.error("Error MFA:", mfaErr);
          setError("No se pudo enviar el código SMS.");
        }
      } else if (err.code === "auth/invalid-email") {
        setError("Correo inválido.");
      } else if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("No se pudo iniciar sesión.");
      }
    }
  };

  const verifySecondFactor = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!resolver) {
        setError("No se encontró la sesión de verificación MFA.");
        return;
      }

      const cred = PhoneAuthProvider.credential(verificationId, smsCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

      await resolver.resolveSignIn(multiFactorAssertion);
      navigate("/Despacho");
    } catch (err) {
      console.error("Error verificando SMS:", err);
      setError("Código SMS incorrecto o expirado.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-signin">
        <section className="wrapper2">
          <div className="heading">
            <h1 className="text text-large">
              <strong>Ingresar</strong>
            </h1>
            <p className="text text-normal">
              New user?{" "}
              <span>
                <a href="/signup" className="text text-links">
                  Create an account
                </a>
              </span>
            </p>
          </div>

          {!showSmsStep ? (
            <form onSubmit={signIn}>
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

              <div id="recaptcha-container" style={{ marginBottom: "16px" }}></div>

              <button
                type="submit"
                name="submit"
                className="input-submit"
                value="Sign In"
              >
                Ingresar
              </button>
            </form>
          ) : (
            <form onSubmit={verifySecondFactor}>
              <div className="input-control">
                <input
                  type="text"
                  placeholder="Ingresa el código SMS"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="input-field"
                />
              </div>

              <button type="submit" className="input-submit">
                Verificar código
              </button>
            </form>
          )}

          {error && <p className="error-message">{error}</p>}
        </section>
      </div>
    </>
  );
};

export default Login;