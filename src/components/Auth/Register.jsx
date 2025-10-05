import React, { useState } from "react";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Register = ({ onClose, onSwitch }) => {
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

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
        if (!lastname) {
            newErrors.lastname = "Last name is required.";
        }
        if (!phonenumber) {
            newErrors.phonenumber = "Phone number is required.";
        } else if (!/^\d{7,15}$/.test(phonenumber)) {
            newErrors.phonenumber = "Phone number is invalid.";
        }
        if (!address) {
            newErrors.address = "Address is required.";
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
            <div className="register" onClick={(e) => e.stopPropagation()}>
                <div className="register-container">
                    <div className="register-header">
                        <FontAwesomeIcon icon={faXmark} onClick={onClose} />
                    </div>
                    <h1 className="register-logo-title">App Name</h1>
                    <p className="register-title">Create an account</p>
                    <p className="register-subtitle">Enter your email to sign up for this app</p>
                    <form className="register-form" onSubmit={handleSubmit}>
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
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="lastname"
                                    placeholder=" "
                                    value={lastname}
                                    onChange={e => setLastname(e.target.value)}
                                    required
                                />
                                <label htmlFor="lastname">Last name</label>
                                {errors.lastname && <span className="error">{errors.lastname}</span>}
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
                                type="text"
                                id="address"
                                placeholder=" "
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                required
                            />
                            <label htmlFor="address">Address</label>
                            {errors.address && <span className="error">{errors.address}</span>}
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

                        <button className="register-submit" type="submit">Sign up with email</button>
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