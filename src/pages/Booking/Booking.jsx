import React, { useState, useEffect } from "react";
import "./Booking.css";
import { bookingApi } from "../../data/mockData.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddBookingModal from "../../components/Modal/AddBookingModal.jsx";

const Booking = () => {
    const [booking, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        bookingApi.getAll().then(setBookings);
    }, []);

    const handleAddBooking = (newBooking) => {
        setBookings(prev => [...prev, newBooking]);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this booking?")) return;
        bookingApi.delete(id).then(() => setBookings(prev => prev.filter(b => b.id !== id)));
    };

    return (
        <section className="booking">
            <div className="booking-header">
                <h1>Bookings</h1>
                <button onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} /> Add Booking
                </button>
            </div>

            {showModal && (
                <AddBookingModal 
                    onClose={() => setShowModal(false)} 
                    onAdd={handleAddBooking} 
                />
            )}

            <table className="booking-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Car</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {booking.map(b => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.user}</td>
                            <td>{b.car}</td>
                            <td>{b.start_date}</td>
                            <td>{b.end_date}</td>
                            <td>€{b.total_price}</td>
                            <td>{b.payment_status}</td>
                            <td>
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(b.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default Booking;
