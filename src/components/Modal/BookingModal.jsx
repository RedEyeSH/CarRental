import React from "react";
import "./Modal.css";

const BookingModal = ({ car, startDate, endDate, onClose }) => {
    const handleBooking = () => {
        alert(`Booking ${car.brand} ${car.model} from ${startDate} to ${endDate}`);
        onClose();
    };

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Book {car.brand} {car.model}</h2>
                <p>From: {startDate}</p>
                <p>To: {endDate}</p>
                <button className="booking-cancel-btn" onClick={onClose}>Cancel</button>
                <button className="booking-confirm-btn" onClick={handleBooking}>Confirm Booking</button>
            </div>
        </div>
    );
};

export default BookingModal;
