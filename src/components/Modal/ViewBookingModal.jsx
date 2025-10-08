import React, { useEffect, useState } from "react";
import "./Modal.css";

const ViewBookingModal = ({ isOpen, onClose, bookingId }) => {
    const [booking, setBooking] = useState(null);
    const [user, setUser] = useState(null);
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !bookingId) return;
        setLoading(true);
        setError(null);
        setUser(null);
        setCar(null);
        const token = localStorage.getItem("token");
        fetch(`http://localhost:3000/api/v1/bookings/${bookingId}`, {
            headers: {
                "Authorization": token ? `Bearer ${token}` : undefined,
                "Content-Type": "application/json",
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch booking data");
                return res.json();
            })
            .then(data => {
                setBooking(data);
                // Fetch user and car in parallel
                const userId = data.user_id || data.user?.id;
                const carId = data.car_id || data.car?.id;
                if (userId) {
                    fetch(`http://localhost:3000/api/v1/auth/users/${userId}`, {
                        headers: {
                            "Authorization": token ? `Bearer ${token}` : undefined,
                            "Content-Type": "application/json",
                        },
                    })
                        .then(res => res.ok ? res.json() : null)
                        .then(userData => setUser(userData))
                        .catch(() => setUser(null));
                }
                if (carId) {
                    fetch(`http://localhost:3000/api/v1/cars/${carId}`, {
                        headers: {
                            "Authorization": token ? `Bearer ${token}` : undefined,
                            "Content-Type": "application/json",
                        },
                    })
                        .then(res => res.ok ? res.json() : null)
                        .then(carData => setCar(carData))
                        .catch(() => setCar(null));
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [isOpen, bookingId]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal booking-modal">
                <h2 className="booking-modal-title">Booking Details</h2>
                {loading ? (
                    <div>Loading booking data...</div>
                ) : error ? (
                    <div className="modal-error">{error}</div>
                ) : booking ? (
                    <div className="booking-details-card">
                        <div className="booking-details-header">
                            {car && car.image && (
                                <div className="booking-car-image-wrapper">
                                    <img className="booking-car-image" src={`http://localhost:3000/public/uploads/${car.image}`} alt={`${car.brand} ${car.model}`} />
                                </div>
                            )}
                            <div className="booking-main-info">
                                <div className="booking-label"><strong>Booking ID:</strong> <span>{booking.id}</span></div>
                                <div className="booking-label"><strong>User:</strong> <span>{user ? user.name : booking.user_id}</span></div>
                                <div className="booking-label"><strong>Car:</strong> <span>{car ? `${car.brand} ${car.model} (${car.license_plate})` : booking.car_id}</span></div>
                            </div>
                        </div>
                        <div className="booking-details-body">
                            <div className="booking-label"><strong>Start Date:</strong> <span>{booking.start_date ? new Date(booking.start_date).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit'}) : "-"}</span></div>
                            <div className="booking-label"><strong>End Date:</strong> <span>{booking.end_date ? new Date(booking.end_date).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit'}) : "-"}</span></div>
                            <div className="booking-label"><strong>Status:</strong> <span>{booking.payment_status}</span></div>
                            <div className="booking-label"><strong>Created At:</strong> <span>{booking.created_at ? new Date(booking.created_at).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}</span></div>
                        </div>
                    </div>
                ) : null}
                <div className="modal-actions">
                    <button type="button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewBookingModal;
