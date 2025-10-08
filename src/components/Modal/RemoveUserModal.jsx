import React, { useState } from "react";
import { toast } from "react-toastify";
import "./Modal.css";

const RemoveUserModal = ({ isOpen, onClose, onUserDeleted, userId, showNotification }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/v1/auth/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Failed to delete user");
            onUserDeleted();
             toast.success("User deleted successfully!");
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="remove-modal">
                <h2>Delete User</h2>
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                {error && <div className="modal-error">{error}</div>}
                <div className="remove-modal-actions">
                    <button className="cancel" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="confirm" onClick={handleDelete} disabled={loading}>{loading ? "Deleting..." : "Delete"}</button>
                </div>
            </div>
        </div>
    );
};

export default RemoveUserModal;

