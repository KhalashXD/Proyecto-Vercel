
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPwDvUEkdfmsYZzHinc95rQzBeQ2TAEJM",
  authDomain: "smart-operation-system.firebaseapp.com",
  projectId: "smart-operation-system",
  storageBucket: "smart-operation-system.appspot.com",
  messagingSenderId: "44638280265",
  appId: "1:44638280265:web:8f6ed9a18163e7cc09bd98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth};