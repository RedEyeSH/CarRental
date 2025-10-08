import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Login from "../Auth/Login.jsx";
import Register from "../Auth/Register.jsx";
import viteLogo from "../../assets/vite.svg";

const Navbar = () => {
    const [authModal, setAuthModal] = useState(null);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    const handleProfileClick = () => {
        navigate("/profile");
        setDropdownOpen(false);
    };

    return (
        <>
            <div className="navbar">
                <Link to="/" className="navbar-logo">
                    <img src={viteLogo} alt="logo" />
                    <p>Logo name</p>
                </Link>

                <div className="navbar-right">
                    <div className="navbar-links"></div>
                    <div className="navbar-buttons">
                        {user ? (
                            <div className="navbar-user" ref={dropdownRef}>
                                <p
                                    className="navbar-username clickable"
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                >
                                    Hi, {user.name} <span className="dropdown-arrow">▾</span>
                                </p>

                                {dropdownOpen && (
                                    <div className="navbar-dropdown">
                                        <p onClick={handleProfileClick}>Profile</p>
                                        <p className="logout-option" onClick={handleLogout}>
                                            Logout
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className="navbar-btn navbar-login" onClick={() => setAuthModal("login")}>
                                    Sign In
                                </button>
                                <button className="navbar-btn navbar-register" onClick={() => setAuthModal("register")}>
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {authModal === "login" && (
                <Login
                    onClose={() => setAuthModal(null)}
                    onSwitch={() => setAuthModal("register")}
                    onLoginSuccess={(userData) => setUser(userData)}
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
};

export default Navbar;
