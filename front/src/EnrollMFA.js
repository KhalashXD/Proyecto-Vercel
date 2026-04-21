import React, { useState } from "react";
import { auth } from "./firebase";
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  multiFactor,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const EnrollMFA = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
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
        }
      );
    }
  };

  const sendSms = async (e) => {
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

      setupRecaptcha();

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
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo enviar el SMS.");
    }
  };

  const verifyAndEnroll = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;

      const cred = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(cred);

      await multiFactor(user).enroll(
        multiFactorAssertion,
        "Teléfono principal"
      );

      alert("Segundo factor activado correctamente.");
      navigate("/Despacho");
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo verificar el código.");
    }
  };

  return (
    <div className="container-signin">
      <section className="wrapper2">
        <h1><strong>Activar verificación por SMS</strong></h1>

        {step === 1 ? (
          <form onSubmit={sendSms}>
            <div className="input-control">
              <input
                type="tel"
                placeholder="Ej: +56912345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field"
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
  );
};

export default EnrollMFA;