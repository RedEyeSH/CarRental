import React, { useState, useEffect } from "react";
import "./Users.css";
import EditUserModal from "../../../components/Modal/EditUserModal.jsx";
import RemoveUserModal from "../../../components/Modal/RemoveUserModal.jsx";
import ViewUserModal from "../../../components/Modal/ViewUserModal.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
    const [selectedUserToView, setSelectedUserToView] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/api/v1/auth/users/", {
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : undefined,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (userId) => {
        setSelectedUserId(userId);
        setEditModalOpen(true);
    };

    const handleModalClose = () => {
        setEditModalOpen(false);
        setSelectedUserId(null);
    };

    const handleDeleteClick = (userId) => {
        setSelectedUserToDelete(userId);
        setRemoveModalOpen(true);
    };

    const handleRemoveModalClose = () => {
        setRemoveModalOpen(false);
        setSelectedUserToDelete(null);
    };

    const handleViewClick = (userId) => {
        setSelectedUserToView(userId);
        setViewModalOpen(true);
    };

    const handleViewModalClose = () => {
        setViewModalOpen(false);
        setSelectedUserToView(null);
    };

    const refreshUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/v1/auth/users/", {
                headers: {
                    "Authorization": token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, exiting: false }]);
        setTimeout(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, exiting: true } : n));
        }, 2500);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    return (
        <div className="users-section">
            <h2>Users</h2>
            <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="users-search"
            />
            {loading ? (
                <div className="users-loading">Loading users...</div>
            ) : error ? (
                <div className="users-error">{error}</div>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Created at</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="6">No users found.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user._id || user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || "N/A"}</td>
                                    <td>{user.role}</td>
                                    <td>{new Date(user.created_at).toLocaleString('en-GB', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}</td>
                                    <td style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>

                                    <button className="users-icon-btn" onClick={() => handleViewClick(user._id || user.id)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>

                                        <button className="users-icon-btn" onClick={() => handleEditClick(user._id || user.id)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>

                                        <button className="users-icon-btn" onClick={() => handleDeleteClick(user._id || user.id)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <div className="notification-container">
                {notifications.map((n, index) => (
                    <div
                        key={n.id}
                        className={`notification ${n.exiting ? "slide-out" : "slide-in"}`}
                        style={{ top: `${index * 60}px` }}
                    >
                        {n.message}
                    </div>
                ))}
            </div>
            <EditUserModal
                userId={selectedUserId}
                isOpen={editModalOpen}
                onClose={handleModalClose}
                onUserUpdated={refreshUsers}
                showNotification={showNotification}
            />
            <RemoveUserModal
                isOpen={removeModalOpen}
                onClose={handleRemoveModalClose}
                onUserDeleted={refreshUsers}
                userId={selectedUserToDelete}
                showNotification={showNotification}
            />
            <ViewUserModal
                isOpen={viewModalOpen}
                onClose={handleViewModalClose}
                userId={selectedUserToView}
            />
        </div>
    );
};

export default Users;
