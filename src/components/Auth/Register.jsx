import React from "react";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Register = ({ onClose, onSwitch }) => {
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
                    <form className="register-form" action="#">
                        <div className="register-email">
                            <input type="email" placeholder="email@domain.com" required />
                        </div>
                        <div className="register-name">
                            <div className="register-firstname">
                                <input type="text" id="firstname" placeholder="First name" required />
                            </div>
                            <div className="register-lastname">
                                <input type="text" id="lastname" placeholder="Last name" required />
                            </div>
                        </div>
                        <div className="register-phone">
                            <input type="text" id="phonenumber" placeholder="Phone number" required />
                        </div>
                        <div className="register-address">
                            <input type="text" id="address" placeholder="Address" required />
                        </div>
                        <div className="register-password">
                            <input type="password" id="register-password" placeholder="Password" required />
                        </div>
                        <div className="register-confirm-password">
                            <input type="password" id="register-confirm-password" placeholder="Confirm password" required />
                        </div>
                        <button className="register-submit" type="submit">Sign up with email</button>
                    </form>
                    <div className="login-option">
                        <p>Don't have an account? <span onClick={onSwitch}>Click here!</span></p>
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