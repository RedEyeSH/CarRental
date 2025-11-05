import React, { use, useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";

const Login = ({ onClose, onSwitch, onLoginSuccess }) => {
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = t("login.errors.emailRequired");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("login.errors.emailInvalid");
        }
        if (!password) {
            newErrors.password = t("login.errors.passwordRequired");
        } else if (password.length < 6) {
            newErrors.password = t("login.errors.passwordMin");
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
                setApiError(data.message || t("login.errors.loginFailed"));
            } else {
                localStorage.setItem("user", JSON.stringify(data.user));
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                if (onLoginSuccess) {
                    onLoginSuccess(data.user)
                }
                onClose();
            }
        } catch (error) {
            setApiError(t("login.errors.networkError"));
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
                    <h1 className="login-logo-title">Car Rental</h1>
                    <p className="login-title">{t("login.title")}</p>
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
                            <label htmlFor="login-email">{t("login.email")}</label>
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
                            <label htmlFor="login-password">{t("login.password")}</label>
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        <button className="login-submit" type="submit" disabled={loading}>
                            {loading ? t("login.signingIn") : t("login.signIn")}
                        </button>
                    </form>

                    <div className="login-option">
                        <p>
                            {t("login.noAccount")}{" "} 
                            <span onClick={onSwitch}>{t("login.clickHere")}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
