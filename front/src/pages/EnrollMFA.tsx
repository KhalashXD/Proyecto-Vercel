import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  multiFactor,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/LoginSignup.css";

const EnrollMFA: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const setupRecaptcha = async (): Promise<void> => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.log("No se pudo limpiar el reCAPTCHA anterior:", e);
      }

      window.recaptchaVerifier = null;
    }

    const container = document.getElementById("recaptcha-container");

    if (container) {
      container.innerHTML = "";
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal",
        callback: () => {
          console.log("reCAPTCHA resuelto");
        },
        "expired-callback": () => {
          setError("El reCAPTCHA expiró. Intenta nuevamente.");
        },
      }
    );

    await window.recaptchaVerifier.render();
  };

  const sendSms = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("No hay un usuario autenticado.");
        return;
      }

      if (!user.emailVerified) {
        setError("Debes verificar tu correo antes de activar MFA.");
        return;
      }

      await setupRecaptcha();

      const multiFactorSession = await multiFactor(user).getSession();

      const phoneInfoOptions = {
        phoneNumber,
        session: multiFactorSession,
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);

      const id = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        window.recaptchaVerifier
      );

      setVerificationId(id);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudo enviar el SMS.");
    }
  };

  const verifyAndEnroll = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("No hay un usuario autenticado.");
        return;
      }

      const cred = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

      await multiFactor(user).enroll(
        multiFactorAssertion,
        "Teléfono principal"
      );

      alert("Segundo factor activado correctamente.");
      navigate("/Despacho");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudo verificar el código.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-signin">
        <section className="wrapper2">
          <div className="heading">
            <h1 className="text text-large">
              <strong>Activar SMS</strong>
            </h1>

            <p className="text text-normal">
              {step === 1
                ? "Ingresa tu número para activar la verificación en dos pasos."
                : "Ingresa el código SMS enviado a tu teléfono."}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={sendSms}>
              <div className="input-control">
                <input
                  type="tel"
                  placeholder="Ej: +56912345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-field"
                  autoComplete="tel"
                />
              </div>

              <div id="recaptcha-container" style={{ marginBottom: "16px" }} />

              <button type="submit" className="input-submit">
                Enviar código
              </button>
            </form>
          ) : (
            <form onSubmit={verifyAndEnroll}>
              <div className="input-control">
                <input
                  type="text"
                  placeholder="Código SMS"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input-field"
                  autoComplete="one-time-code"
                />
              </div>

              <button type="submit" className="input-submit">
                Verificar y activar
              </button>
            </form>
          )}

          {error && <p className="error-message">{error}</p>}
        </section>
      </div>
    </>
  );
};

export default EnrollMFA;