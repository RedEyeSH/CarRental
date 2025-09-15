import React, { useState } from "react";
import './Navbar.css';
import Login from '../Auth/Login.jsx';
import Register from '../Auth/Register.jsx';

const Navbar = () => {
    const [authModal, setAuthModal] = useState(null);

    return (
        <>
            <div className="navbar">
                <div className="navbar-logo">
                    <img src="/vite.svg" alt="logo" />
                    <p>Logo name</p>
                </div>
                <div className="navbar-right">
                    <div className="navbar-links">
                        <div className="navbar-link">
                            <p>Products</p>
                        </div>
                        <div className="navbar-link">
                            <p>Pricing</p>
                        </div>
                        <div className="navbar-link">
                            <p>Contact</p>
                        </div>
                    </div>
                    <div className="navbar-buttons">
                        <div className="navbar-login">
                            <button onClick={() => setAuthModal("login")}>Sign in</button>
                        </div>
                        <div className="navbar-register">
                            <button onClick={() => setAuthModal("register")}>Register</button>
                        </div>
                    </div>
                </div>
            </div>
            {authModal === "login" && (
                <Login 
                    onClose={() => setAuthModal(null)} 
                    onSwitch={() => setAuthModal("register")}
                />
            )}

            {authModal === "register" && (
                <Register 
                    onClose={() => setAuthModal(null)} 
                    onSwitch={() => setAuthModal("login")}
                />
            )}
        </>
    );
}

export default Navbar;