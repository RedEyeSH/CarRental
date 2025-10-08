import React, { useState, useEffect } from "react";
import "./Feedback.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]); // Store users
    const [cars, setCars] = useState([]);   // Store cars
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                // Fetch feedbacks
                const feedbacksPromise = fetch("http://localhost:3000/api/v1/feedbacks", {
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : undefined,
                        "Content-Type": "application/json",
                    },
                }).then(res => {
                    if (!res.ok) throw new Error("Failed to fetch feedbacks");
                    return res.json();
                });
                // Fetch users
                const usersPromise = fetch("http://localhost:3000/api/v1/auth/users", {
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : undefined,
                        "Content-Type": "application/json",
                    },
                }).then(res => {
                    if (!res.ok) throw new Error("Failed to fetch users");
                    return res.json();
                });
                // Fetch cars
                const carsPromise = fetch("http://localhost:3000/api/v1/cars", {
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : undefined,
                        "Content-Type": "application/json",
                    },
                }).then(res => {
                    if (!res.ok) throw new Error("Failed to fetch cars");
                    return res.json();
                });
                const [feedbacksData, usersData, carsData] = await Promise.all([
                    feedbacksPromise, usersPromise, carsPromise
                ]);
                setFeedbacks(Array.isArray(feedbacksData) ? feedbacksData : []);
                setUsers(Array.isArray(usersData) ? usersData : []);
                setCars(Array.isArray(carsData) ? carsData : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Helper to get user name by id
    const getUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) return userId || "-";
        if (user.first_name || user.last_name) {
            return `${user.first_name || ''} ${user.last_name || ''}`.trim();
        }
        return user.email || userId || "-";
    };

    // Helper to get car brand/model by id
    const getCarInfo = (carId) => {
        const car = cars.find(c => c.id === carId);
        if (!car) return carId || "-";
        return `${car.brand || ''} ${car.model || ''}`.trim() || carId || "-";
    };

    const filteredFeedbacks = feedbacks.filter(fb => {
        const term = searchTerm.toLowerCase();
        // Search by user name, email, car brand/model, comment, or rating
        const user = users.find(u => u.id === fb.user_id);
        const car = cars.find(c => c.id === fb.car_id);
        return (
            (user && ((user.first_name && user.first_name.toLowerCase().includes(term)) ||
                      (user.last_name && user.last_name.toLowerCase().includes(term)) ||
                      (user.email && user.email.toLowerCase().includes(term)))) ||
            (car && ((car.brand && car.brand.toLowerCase().includes(term)) ||
                     (car.model && car.model.toLowerCase().includes(term)))) ||
            (fb.comment && fb.comment.toLowerCase().includes(term)) ||
            (fb.rating && fb.rating.toString().includes(term))
        );
    });

    // Notification system for future extensibility
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

    // Delete feedback handler
    const handleDelete = async () => {
        if (!feedbackToDelete) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/v1/feedbacks/${feedbackToDelete.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : undefined,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to delete feedback");
            setFeedbacks(prev => prev.filter(fb => fb.id !== feedbackToDelete.id));
            showNotification("Feedback deleted successfully.");
            setDeleteModalOpen(false);
            setFeedbackToDelete(null);
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="feedbacks-section">
            <h2>Feedback</h2>
            <input
                type="text"
                placeholder="Search by user, car, or message"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="feedbacks-search"
            />
            {loading ? (
                <div className="feedbacks-loading">Loading feedbacks...</div>
            ) : error ? (
                <div className="feedbacks-error">{error}</div>
            ) : (
                <table className="feedbacks-table">
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Car</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredFeedbacks.length === 0 ? (
                        <tr><td colSpan="6">No feedbacks found.</td></tr>
                    ) : (
                        filteredFeedbacks.map(fb => (
                            <tr key={fb.id}>
                                <td>{getUserName(fb.user_id)}</td>
                                <td>{getCarInfo(fb.car_id)}</td>
                                <td>{fb.rating != null ? fb.rating : "-"}</td>
                                <td>{fb.comment || "-"}</td>
                                <td>{fb.created_at ? new Date(fb.created_at).toLocaleString('en-GB', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }) : "-"}</td>
                                <td style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                                    <button className="feedbacks-icon-btn" onClick={() => { setDeleteModalOpen(true); setFeedbackToDelete(fb); }} title="Delete">
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal delete-modal">
                        <h3>Delete Feedback</h3>
                        <p>Are you sure you want to delete this feedback?</p>
                        <div style={{ margin: '12px 0', fontSize: '0.95em', color: '#ffffff' }}>
                            <strong>User:</strong> {feedbackToDelete ? getUserName(feedbackToDelete.user_id) : ''}<br />
                            <strong>Car:</strong> {feedbackToDelete ? getCarInfo(feedbackToDelete.car_id) : ''}<br />
                            <strong>Comment:</strong> {feedbackToDelete ? feedbackToDelete.comment : ''}
                        </div>
                        {deleteError && <div className="feedbacks-error" style={{ marginBottom: 8 }}>{deleteError}</div>}
                        <div className="modal-actions">
                            <button onClick={() => { setDeleteModalOpen(false); setFeedbackToDelete(null); }} disabled={deleting}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="danger" disabled={deleting}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
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
        </div>
    );
};

export default Feedbacks;

