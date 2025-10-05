import React, { useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Login = ({ onClose, onSwitch }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid.";
        }
        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
        }
    };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="login" onClick={(e) => e.stopPropagation()}>
                <div className="login-container">
                    <div className="login-header">
                        {/* <h2>Sign in</h2> */}
                        <FontAwesomeIcon icon={faXmark} onClick={onClose} />
                    </div>
                    <h1 className="login-logo-title">App Name</h1>
                    <p className="login-title">Already have an account?</p>
                    <p className="login-subtitle">Enter your email and password to sign in.</p>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input 
                                type="email" 
                                id="login-email" 
                                placeholder=" " 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required 
                            />
                            <label htmlFor="email">Email address</label>
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <input 
                                type="password" 
                                id="login-password" 
                                placeholder=" "
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required 
                            />
                            <label htmlFor="password">Password</label>
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>
                        <button className="login-submit" type="submit">Sign in</button>
                    </form>
                    <div className="login-option">
                        <p>Don't have an account? <span onClick={onSwitch}>Click here!</span></p>
                    </div>
                    <div className="login-terms">
                        <p>By clicking continue, you agree to our <span>Terms of service</span> and <span>Privacy Policy</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;