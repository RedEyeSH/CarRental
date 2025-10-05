import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Login from "../Auth/Login.jsx";
import Register from "../Auth/Register.jsx";
import viteLogo from '../../assets/vite.svg';

const Navbar = () => {
    const [authModal, setAuthModal] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <>
            <div className="navbar">
                <Link to="/" className="navbar-logo">
                    <img src={viteLogo} alt="logo" />
                    <p>Logo name</p>
                </Link>
                <div className="navbar-right">
                    <div className="navbar-links">
                        <div className="navbar-link"><p>Products</p></div>
                        <div className="navbar-link"><p>Pricing</p></div>
                        <div className="navbar-link"><p>Contact</p></div>
                    </div>
                    <div className="navbar-buttons">
                        {loggedIn ? (
                            <div className="navbar-profile">
                                <button onClick={() => alert("Go to Profile")}>Profile</button>
                            </div>
                        ) : (
                            <>
                                <div className="navbar-login">
                                    <button onClick={() => setAuthModal("login")}>Sign in</button>
                                </div>
                                <div className="navbar-register">
                                    <button onClick={() => setAuthModal("register")}>Register</button>
                                </div>
                            </>
                        )}
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
