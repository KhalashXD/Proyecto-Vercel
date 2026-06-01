import { RecaptchaVerifier } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    webkitAudioContext?: typeof AudioContext;
  }
}

export {};
