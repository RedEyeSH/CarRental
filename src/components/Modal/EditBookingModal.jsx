import React, { useState, useEffect } from "react";
import "./Modal.css";

const EditBookingModal = ({ bookingId, onClose, onBookingEdited, token, users = [], cars = [] }) => {
    const [formData, setFormData] = useState({
        user_id: "",
        car_id: "",
        start_date: "",
        end_date: "",
        total_price: "",
        payment_status: "PENDING",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!bookingId) return;
        const fetchBooking = async () => {
            setLoading(true);
            setError(null);
            try {
                const authToken = token || localStorage.getItem("token");
                const res = await fetch(`http://localhost:3000/api/v1/bookings/${bookingId}`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch booking details");
                const data = await res.json();
                setFormData({
                    user_id: data.user_id ? String(data.user_id) : "",
                    car_id: data.car_id ? String(data.car_id) : "",
                    start_date: data.start_date ? data.start_date.slice(0, 10) : "",
                    end_date: data.end_date ? data.end_date.slice(0, 10) : "",
                    total_price: data.total_price || "",
                    payment_status: data.payment_status || "PENDING",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const authToken = token || localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3000/api/v1/bookings/${bookingId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to update booking");
            const updatedBooking = await res.json();
            if (onBookingEdited) onBookingEdited(updatedBooking);
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>Edit Booking</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <select name="user_id" value={formData.user_id} onChange={handleChange} required>
                                <option value="" disabled>Select user</option>
                                {users.map(user => (
                                    <option key={user.id} value={String(user.id)}>
                                        {user.full_name || user.name || user.email || user.username || user.id}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="user_id">User</label>
                        </div>
                        <div className="form-group">
                            <select name="car_id" value={formData.car_id} onChange={handleChange} required>
                                <option value="" disabled>Select car</option>
                                {cars.map(car => (
                                    <option key={car.id} value={String(car.id)}>
                                        {car.brand} {car.model}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="car_id">Car</label>
                        </div>
                        <div className="form-group">
                            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required placeholder=" " />
                            <label htmlFor="start_date">Start Date</label>
                        </div>
                        <div className="form-group">
                            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required placeholder=" " />
                            <label htmlFor="end_date">End Date</label>
                        </div>
                        <div className="form-group">
                            <input type="number" name="total_price" value={formData.total_price} onChange={handleChange} required placeholder=" " />
                            <label htmlFor="total_price">Total (€)</label>
                        </div>
                        <div className="form-group">
                            <select name="payment_status" value={formData.payment_status} onChange={handleChange} required>
                                <option value="PENDING">PENDING</option>
                                <option value="PAID">PAID</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="REFUNDED">REFUNDED</option>
                            </select>
                            <label htmlFor="payment_status">Payment Status</label>
                        </div>
                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">Save Changes</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditBookingModal;
