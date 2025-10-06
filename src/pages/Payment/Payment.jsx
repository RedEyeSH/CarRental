import React, { useState, useEffect } from "react";
import "./Payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get car and initial dates from router state
    const { car, startDate: initialStartDate, endDate: initialEndDate } = location.state || {};

    const [startDate, setStartDate] = useState(initialStartDate || "");
    const [endDate, setEndDate] = useState(initialEndDate || "");
    const [total, setTotal] = useState(0);
    const [payment, setPayment] = useState({ method: "Credit Card", status: "Pending" });

    // Redirect if car data is missing
    useEffect(() => {
        if (!car) {
            navigate("/"); // go back to home if no car
        }
    }, [car, navigate]);

    // Recalculate total whenever dates or car change
    useEffect(() => {
        if (startDate && endDate && car) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
            setTotal((diffDays * parseFloat(car.price_per_day)).toFixed(2));
        }
    }, [startDate, endDate, car]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }
        alert(`Payment successful for €${total} via ${payment.method}`);
        navigate("/"); // redirect after payment
    };

    if (!car) return null; // or a loading indicator

    return (
        <section className="payment">
            <div className="payment-header">
                <h1>
                    <FontAwesomeIcon icon={faCreditCard} /> Checkout
                </h1>
            </div>
            <div className="payment-content">
                <div className="payment-car">
                    <img
                        src={`http://localhost:3000/public/uploads/${car.image}`}
                        alt={`${car.brand} ${car.model}`}
                        className="payment-car-image"
                        draggable={false}
                    />
                    <div className="payment-car-details">
                        <h2>{car.brand} {car.model} ({car.year})</h2>
                        <p>€{car.price_per_day}/day</p>
                    </div>
                </div>
                <div className="payment-checkout">
                    <h2>Payment Details</h2>
                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="form-group">
                            <input
                                type="date"
                                id="start_date"
                                value={startDate}
                                onChange={(e) => {
                                    const newStart = e.target.value;
                                    setStartDate(newStart);

                                    if (endDate && new Date(endDate) < new Date(newStart)) {
                                        setEndDate(newStart);
                                    }
                                }}
                                required
                            />
                            <label htmlFor="start_date">Start Date</label>
                        </div>
                        <div className="form-group">
                            <input
                                type="date"
                                id="end_date"
                                value={endDate}
                                onChange={(e) => {
                                    const newEnd = e.target.value;

                                    if (startDate && new Date(newEnd) < new Date(startDate)) {
                                        alert("End date cannot be before start date");
                                        return;
                                    }

                                    setEndDate(newEnd);
                                }}
                                required
                            />
                            <label htmlFor="end_date">End Date</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                value={startDate && endDate ? `${startDate} → ${endDate}` : ""}
                                placeholder="Rental Period"
                                readOnly
                            />
                            <label>Rental Period</label>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                value={`€${total}`}
                                placeholder="Total Cost"
                                readOnly
                            />
                            <label>Total Cost</label>
                        </div>
                        <div className="form-group">
                            <select
                                name="method"
                                value={payment.method}
                                onChange={handleChange}
                            >
                                <option>Credit Card</option>
                                <option>PayPal</option>
                                <option>Bank Transfer</option>
                            </select>
                            <label>Payment Method</label>
                        </div>
                        <button type="submit">Confirm Payment</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Payment;
