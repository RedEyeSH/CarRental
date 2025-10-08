import React, { useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Login = ({ onClose, onSwitch, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else {
            setErrors({});
        }

        setLoading(true);
        setApiError("");

        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setApiError(data.message || "Login failed.");
            } else {
                localStorage.setItem("user", JSON.stringify(data.user));
                if (onLoginSuccess) {
                    onLoginSuccess(data.user)
                }
                onClose();
            }
        } catch (error) {
            setApiError("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="login" onClick={(e) => e.stopPropagation()}>
                <div className="login-container">
                    <div className="login-header">
                        <FontAwesomeIcon icon={faXmark} onClick={onClose} />
                    </div>
                    <h1 className="login-logo-title">App Name</h1>
                    <p className="login-title">Sign in to continue</p>
                    <form className="login-form" onSubmit={handleSubmit}>
                        {apiError && <div className="error api-error">{apiError}</div>}

                        <div className="form-group">
                            <input
                                type="email"
                                id="login-email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="login-email">Email address</label>
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="login-password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="login-password">Password</label>
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        <button className="login-submit" type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="login-option">
                        <p>Don't have an account? <span onClick={onSwitch}>Click here!</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
