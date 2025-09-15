import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from 'react';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onClose, onSwitch }) => {
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
                    <form className="login-form" action="#">
                        <div className="login-email">
                            <input type="email" id="login-email" placeholder="email@domain.com" required />
                        </div>
                        <div className="login-password">
                            <input type="password" id="login-password" placeholder="password" required />
                        </div>
                        <button className="login-submit" type="submit">Sign in</button>
                    </form>
                    <div className="login-option">
                        <p>Don"t have a account? <span onClick={onSwitch}>Click here!</span></p>
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