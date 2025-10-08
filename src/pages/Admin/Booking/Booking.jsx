import React, { useState, useEffect } from "react";
import "./Booking.css";
import EditBookingModal from "../../../components/Modal/EditBookingModal";
import RemoveBookingModal from "../../../components/Modal/RemoveBookingModal";
import ViewBookingModal from "../../../components/Modal/ViewBookingModal.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [removeModal, setRemoveModal] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedBookingToView, setSelectedBookingToView] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No auth token found in localStorage.");
                }
                const response = await fetch("http://localhost:3000/api/v1/bookings/", {
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "",
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/api/v1/auth/users/", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                setUsers(data);
            } catch (err) {}
        };
        const fetchCars = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/api/v1/cars/", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch cars");
                const data = await response.json();
                setCars(data);
            } catch (err) {}
        };
        fetchBookings();
        fetchUsers();
        fetchCars();
    }, []);

    // Notification logic
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

    // Update bookings after edit
    const handleBookingEdited = (updatedBooking) => {
        setBookings((prev) => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        showNotification("Booking updated successfully!");
    };

    // Delete booking handler
    const handleDeleteBooking = async (bookingId) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3000/api/v1/bookings/${bookingId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete booking");
            setBookings(prev => prev.filter(b => b.id !== bookingId));
            setRemoveModal(null);
            showNotification("Booking deleted successfully!");
        } catch (err) {
            setRemoveModal(null);
            showNotification("Failed to delete booking!");
        }
    };

    const handleViewClick = (bookingId) => {
        setSelectedBookingToView(bookingId);
        setViewModalOpen(true);
    };
    const handleViewModalClose = () => {
        setViewModalOpen(false);
        setSelectedBookingToView(null);
    };

    // Filter bookings by search term (user name, car, or booking id)
    const filteredBookings = bookings.filter(b => {
        const user = users.find(u => u.id === b.user_id);
        const car = cars.find(c => c.id === b.car_id);
        const userName = user ? user.name : "";
        const carName = car ? `${car.brand} ${car.model}` : "";
        return (
            userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(b.id).includes(searchTerm)
        );
    });

    return (
        <section className="booking-section">
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
            <h2>Bookings</h2>
            <input
                className="booking-search"
                type="text"
                placeholder="Search by user, car, or booking ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 20 }}
            />
            {loading && <p className="booking-loading">Loading bookings...</p>}
            {error && <p className="booking-error">Error: {error}</p>}
            {!loading && !error && (
                <table className="booking-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Car</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Total (€)</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBookings.map((b) => {
                        const user = users.find(u => u.id === b.user_id);
                        const car = cars.find(c => c.id === b.car_id);
                        const userName = user ? (user.name) : "Unknown";
                        const carName = car ? `${car.brand} ${car.model}` : "Unknown";
                        return (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{userName}</td>
                            <td>{carName}</td>
                            <td>{new Date(b.start_date).toLocaleString('en-GB', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}</td>
                            <td>{new Date(b.end_date).toLocaleString('en-GB', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}</td>
                            <td>{b.total_price}</td>
                            <td>{b.payment_status}</td>
                            <td style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                                <button
                                    className="booking-icon-btn"
                                    title="View"
                                    onClick={() => handleViewClick(b.id)}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button
                                    className="booking-icon-btn"
                                    title="Edit"
                                    onClick={() => { setSelectedBookingId(b.id); setEditModalOpen(true); }}
                                    style={{ marginLeft: 8 }}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    className="booking-icon-btn"
                                    title="Delete"
                                    onClick={() => setRemoveModal(b)}
                                    style={{ marginLeft: 8 }}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </td>
                        </tr>
                    )})}
                    </tbody>
                </table>
            )}
            {editModalOpen && (
                <EditBookingModal
                    bookingId={selectedBookingId}
                    onClose={() => setEditModalOpen(false)}
                    onBookingEdited={handleBookingEdited}
                    users={users}
                    cars={cars}
                />
            )}
            {removeModal && (
                <RemoveBookingModal
                    booking={removeModal}
                    onCancel={() => setRemoveModal(null)}
                    onConfirm={handleDeleteBooking}
                />
            )}
            <ViewBookingModal
                isOpen={viewModalOpen}
                onClose={handleViewModalClose}
                bookingId={selectedBookingToView}
            />
        </section>
    );
};

export default Booking;
