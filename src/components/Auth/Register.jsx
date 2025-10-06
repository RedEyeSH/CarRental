import React, { useState } from "react";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Register = ({ onClose, onSwitch }) => {
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
        if (!firstname) {
            newErrors.firstname = "First name is required.";
        }
        if (!phonenumber) {
            newErrors.phonenumber = "Phone number is required.";
        } else if (!/^\d{7,15}$/.test(phonenumber)) {
            newErrors.phonenumber = "Phone number is invalid.";
        }
        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
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
            const response = await fetch("http://localhost:3000/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: firstname,
                    email: email,
                    password: password,
                    phone: phonenumber,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setApiError(data.message || "Registration failed.");
            } else {
                // Registration successful, close modal or show success
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
            <div className="register" onClick={(e) => e.stopPropagation()}>
                <div className="register-container">
                    <div className="register-header">
                        <FontAwesomeIcon icon={faXmark} onClick={onClose} />
                    </div>
                    <h1 className="register-logo-title">App Name</h1>
                    <p className="register-title">Create an account</p>
                    <p className="register-subtitle">Enter your email to sign up for this app</p>
                    <form className="register-form" onSubmit={handleSubmit}>
                        {apiError && <div className="error api-error">{apiError}</div>}
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Email address</label>
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>

                        <div className="register-name">
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="firstname"
                                    placeholder=" "
                                    value={firstname}
                                    onChange={e => setFirstname(e.target.value)}
                                    required
                                />
                                <label htmlFor="firstname">First name</label>
                                {errors.firstname && <span className="error">{errors.firstname}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                id="phonenumber"
                                placeholder=" "
                                value={phonenumber}
                                onChange={e => setPhonenumber(e.target.value)}
                                required
                            />
                            <label htmlFor="phonenumber">Phone number</label>
                            {errors.phonenumber && <span className="error">{errors.phonenumber}</span>}
                        </div>


                        <div className="form-group">
                            <input
                                type="password"
                                id="register-password"
                                placeholder=" "
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="register-password">Password</label>
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="register-confirm-password"
                                placeholder=" "
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="register-confirm-password">Confirm password</label>
                            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                        </div>

                        <button className="register-submit" type="submit" disabled={loading}>
                            {loading ? "Registering..." : "Sign up with email"}
                        </button>
                    </form>

                    <div className="login-option">
                        <p>Already have an account? <span onClick={onSwitch}>Click here!</span></p>
                    </div>
                    <div className="register-terms">
                        <p>By clicking continue, you agree to our <span>Terms of service</span> and <span>Privacy Policy</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;