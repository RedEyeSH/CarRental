import React, { useState, useEffect } from "react";
import "./Modal.css";
import { bookingApi } from "../../data/mockData.js";
import { cars } from "../../data/mockData.js";
import { toast } from "react-toastify";

const AddBookingModal = ({ onClose, onAdd }) => {
    const [newBooking, setNewBooking] = useState({
        user: "",
        car: "",
        start_date: "",
        end_date: "",
        total_price: 0,
        payment_status: "PENDING"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNewBooking(prev => {
            const updatedBooking = { ...prev, [name]: value };
            if (updatedBooking.start_date && updatedBooking.end_date && updatedBooking.car) {
                const start = new Date(updatedBooking.start_date);
                const end = new Date(updatedBooking.end_date);
                const days = Math.max((end - start) / (1000 * 60 * 60 * 24), 0);

                const carObj = cars.find(c => c.name === updatedBooking.car);
                const pricePerDay = carObj ? carObj.price : 0;

                updatedBooking.total_price = days * pricePerDay;
            }
            return updatedBooking;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        bookingApi.create(newBooking).then(created => {
            onAdd(created);
            toast.success("Booking added successfully!");
            onClose();
         }).catch(err => {
            console.error(err);
            toast.error("Error adding booking");
        });
    };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Booking</h2>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="user" value={newBooking.user} onChange={handleChange} placeholder=" " required />
                        <label htmlFor="user">Username</label>
                    </div>
                    <div className="form-group">
                        <input type="text" name="car" value={newBooking.car} onChange={handleChange} placeholder=" " required />
                        <label htmlFor="car">Car</label>
                    </div>
                    <div className="form-group">
                        <input type="date" name="start_date" value={newBooking.start_date} onChange={handleChange} placeholder=" " required />
                        <label htmlFor="start_date">Start Date</label>
                    </div>
                    <div className="form-group">
                        <input type="date" name="end_date" value={newBooking.end_date} onChange={handleChange} placeholder=" " required />
                        <label htmlFor="end_date">End Date</label>
                    </div>
                    <div className="form-group">
                        <input type="number" name="total_price" value={newBooking.total_price} readOnly placeholder=" " />
                        <label htmlFor="total_price">Total Price (€)</label>
                    </div>
                    <div className="form-group">
                        <select name="payment_status" value={newBooking.payment_status} onChange={handleChange}>
                            <option>PENDING</option>
                            <option>PAID</option>
                            <option>CANCELLED</option>
                        </select>
                        <label htmlFor="payment_status">Status</label>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Add Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookingModal;
