import React, { useEffect, useState } from "react";
import "./Modal.css";

const ViewUserModal = ({ isOpen, onClose, userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !userId) return;
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        fetch(`http://localhost:3000/api/v1/auth/users/${userId}`, {
            headers: {
                "Authorization": token ? `Bearer ${token}` : undefined,
                "Content-Type": "application/json",
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch user data");
                return res.json();
            })
            .then(data => setUser(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [isOpen, userId]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>User Details</h2>
                {loading ? (
                    <div>Loading user data...</div>
                ) : error ? (
                    <div className="modal-error">{error}</div>
                ) : user ? (
                    <div className="view-user-details">
                        <div><strong>Name:</strong> {user.name}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Phone:</strong> {user.phone || "N/A"}</div>
                        <div><strong>Role:</strong> {user.role}</div>
                        <div><strong>Created at:</strong> {new Date(user.created_at).toLocaleString('en-GB', {
                            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}</div>
                    </div>
                ) : null}
                <div className="modal-actions">
                    <button type="button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewUserModal;

