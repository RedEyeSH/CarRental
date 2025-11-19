import React, { useEffect, useState } from "react";
import "./Modal.css";
import { toast } from "react-toastify";

const roles = ["ADMIN", "CUSTOMER"];

const EditUserModal = ({ userId, isOpen, onClose, onUserUpdated }) => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", role: "CUSTOMER" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (!isOpen || !userId) return;
        setFetching(true);
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
            .then(data => {
                setForm({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    role: data.role || "CUSTOMER"
                });
            })
            .catch(err => setError(err.message))
            .finally(() => setFetching(false));
    }, [isOpen, userId]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/v1/auth/users/${userId}`, {
                method: "PUT",
              headers: {
                    "Authorization": token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to update user");
            const updated = await res.json();
            onUserUpdated && onUserUpdated(updated);
            toast.success("User updated successfully!");
            onClose();
        } catch (err) {
            setError(err.message);
            toast.error("Error updating user");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit User</h2>
                {fetching ? (
                    <div>Loading user data...</div>
                ) : (
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input name="name" value={form.name} onChange={handleChange} required placeholder=" " />
                            <label>Name</label>
                        </div>
                        <div className="form-group">
                            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder=" " />
                            <label>Email</label>
                        </div>
                        <div className="form-group">
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder=" " />
                            <label>Phone</label>
                        </div>
                        <div className="form-group">
                            <select name="role" value={form.role} onChange={handleChange} required>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <label>Role</label>
                        </div>
                        {error && <div className="modal-error">{error}</div>}
                        <div className="modal-actions">
                            <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
                            <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditUserModal;
