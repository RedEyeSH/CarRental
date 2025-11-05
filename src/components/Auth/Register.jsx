import React, { useState } from "react";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";

const Register = ({ onClose, onSwitch }) => {
    const { t } = useTranslation();

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
            newErrors.email = t("register.errors.emailRequired");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("register.errors.emailInvalid");
        }
        if (!firstname) {
            newErrors.firstname = t("register.errors.firstnameRequired");
        }
        if (!phonenumber) {
            newErrors.phonenumber = t("register.errors.phoneRequired");
        } else if (!/^\d{7,15}$/.test(phonenumber)) {
            newErrors.phonenumber = t("register.errors.phoneInvalid");
        }
        if (!password) {
            newErrors.password = t("register.errors.passwordRequired");
        } else if (password.length < 6) {
            newErrors.password = t("register.errors.passwordMin");
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = t("register.errors.confirmPasswordRequired");
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = t("register.errors.passwordMismatch");
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
                setApiError(data.message || t("register.errors.registrationFailed"));
            } else {
                // Registration successful, close modal or show success
                onClose();
            }
        } catch (error) {
            setApiError(t("register.errors.networkError"));
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
                    <h1 className="register-logo-title">Car Rental</h1>
                    <p className="register-title">{t("register.title")}</p>
                    <p className="register-subtitle">{t("register.subtitle")}</p>
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
                            <label htmlFor="email">{t("register.email")}</label>
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
                                <label htmlFor="firstname">{t("register.firstname")}</label>
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
                            <label htmlFor="phonenumber">{t("register.phone")}</label>
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
                            <label htmlFor="register-password">{t("register.password")}</label>
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
                            <label htmlFor="register-confirm-password">{t("register.confirmPassword")}</label>
                            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                        </div>

                        <button className="register-submit" type="submit" disabled={loading}>
                            {loading ? t("register.registering") : t("register.signUp")}
                        </button>
                    </form>

                    <div className="login-option">
                        <p>
                            {t("register.alreadyHaveAccount")}{" "} 
                            <span onClick={onSwitch}>{t("register.clickHere")}</span>
                        </p>
                    </div>
                    <div className="register-terms">
                        <p>
                            {t("register.termsIntro")} <span>{t("register.termsOfService")}</span> {t("register.and")} <span>{t("register.privacyPolicy")}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;