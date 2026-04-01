import React, { useState } from "react";
import "./LoginSignup.css";
import Navbar from './Navbar';
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate("");

    const signIn = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate("/Despacho");
            })
            .catch((error) => {
                // Determinar el tipo de error
                let errorMessage = "Authentication failed. Please check your credentials.";

                if (error.code === "auth/invalid-email") {
                    errorMessage = "Invalid email address.";
                } else if (error.code === "auth/wrong-password") {
                    errorMessage = "Invalid password.";
                }

                setError(errorMessage);
            });
    };

    return (
        <>
            <Navbar />
            <div className="container-signin">
                <section className="wrapper2">
                    <div className="heading">
                        <h1 className="text text-large"><strong>Ingresar</strong></h1>
                        <p className="text text-normal">New user? <span><a href="/signup" className="text text-links">Create an account</a></span></p>
                    </div>
                    <form onSubmit={signIn}>
                        <div className="input-control">
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e)=> setEmail(e.target.value)} className="input-field" />
                        </div>
                        <div className="input-control">
                            <input type="password" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} className="input-field" />
                        </div>
                        <button type="submit" name="submit" className="input-submit" value="Sign In">Ingresar</button>
                    </form>
                    
                    {error && <p className="error-message">{error}</p>}
                </section>
            </div>
        </>
    );
};

export default Login;