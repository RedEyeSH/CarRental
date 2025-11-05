import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Login from "../Auth/Login.jsx";
import Register from "../Auth/Register.jsx";
import viteLogo from "../../assets/vite.svg";
import { useAuth } from "../../contexts/AuthContext.jsx";

import { useTranslation } from "react-i18next";

const Navbar = () => {
    const { t } = useTranslation();

    const [authModal, setAuthModal] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const { user, loading, error, logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
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
                    {/* <img src={viteLogo} alt="logo" /> */}
                    <p>Car Rental</p>
                </Link>
                <div className="navbar-right">
                    <div className="navbar-links"></div>
                    <div className="navbar-buttons">
                        {loading ? (
                            <span>{t("navbar.loading")}</span>
                        ) : user ? (
                            <div className="navbar-user" ref={dropdownRef}>
                                <p
                                    className="navbar-username clickable"
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                >
                                    {t("navbar.greeting", { name: user.name })} <span className="dropdown-arrow"></span>
                                </p>

                                {dropdownOpen && (
                                    <div className="navbar-dropdown">
                                        <p onClick={handleProfileClick}>{t("navbar.profile")}</p>
                                        <p className="logout-option" onClick={handleLogout}>
                                            {t("navbar.logout")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : error ? (
                            <span style={{ color: 'red' }}>{error}</span>
                        ) : (
                            <>
                                <button className="navbar-btn navbar-login" onClick={() => setAuthModal("login")}>
                                    {t("navbar.signIn")}
                                </button>
                                <button className="navbar-btn navbar-register" onClick={() => setAuthModal("register")}>
                                    {t("navbar.register")}
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
                    onLoginSuccess={() => window.location.reload()}
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
