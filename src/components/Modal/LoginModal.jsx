import React, { useState } from "react";
import "./Modal.css";

const LoginModal = ({ isOpen, onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Login failed");
                setLoading(false);
                return;
            }
            if (data.user && data.user.role === "ADMIN") {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError("Access denied: Admins only");
            }
        } catch (err) {
            setError("Network error");
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal login-modal">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    {error && <div className="modal-error">{error}</div>}
                    <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
