import React, { useState, useEffect } from "react";
import "./Payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { useParams, useLocation } from "react-router-dom";
import { cars as mockCars } from "../../data/mockData.js";

const Payment = () => {
    const { bookingId: carId } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const startDate = query.get("start");
    const endDate = query.get("end");

    const [car, setCar] = useState(null);
    const [total, setTotal] = useState(0);
    const [payment, setPayment] = useState({
        method: "Credit Card",
        status: "Pending",
    });

    useEffect(() => {
        if (carId) {
            const selectedCar = mockCars.find((c) => String(c.id) === String(carId));
            if (selectedCar) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
                const totalCost = diffDays * selectedCar.price;

                setCar(selectedCar);
                setTotal(totalCost.toFixed(2));
            }
        }
    }, [carId, startDate, endDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Payment successful for €${total} via ${payment.method}`);
    };

    if (!car) return <p className="error">Car not found or invalid booking.</p>;

    return (
        <section className="payment">
            <div className="payment-header">
                <h1>
                    <FontAwesomeIcon icon={faCreditCard} /> Checkout
                </h1>
            </div>

            <div className="payment-content">
                <div className="payment-car">
                    <img src={car.image} alt={car.brand} className="payment-car-image" />
                    <div className="payment-car-details">
                        <h2>{car.name} {car.model} ({car.creationDate})</h2>
                    </div>
                </div>

                <div className="payment-checkout">
                    <h2>Payment Details</h2>
                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="form-group">
                            <input
                                type="text"
                                id="price_per_day"
                                name="price_per_day"
                                value={`€${car.price}`}
                                placeholder=" "
                                readOnly
                            />
                            <label htmlFor="price_per_day">Price per Day</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                id="rental_period"
                                name="rental_period"
                                value={`${startDate} → ${endDate}`}
                                placeholder=" "
                                readOnly
                            />
                            <label htmlFor="rental_period">Rental Period</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                id="total_cost"
                                name="total_cost"
                                value={`€${total}`}
                                placeholder=" "
                                readOnly
                            />
                            <label htmlFor="total_cost">Total Cost</label>
                        </div>

                        <div className="form-group">
                            <select
                                id="payment_method"
                                name="method"
                                value={payment.method}
                                onChange={handleChange}
                            >
                                <option>Credit Card</option>
                                <option>PayPal</option>
                                <option>Bank Transfer</option>
                            </select>
                            <label htmlFor="payment_method">Payment Method</label>
                        </div>

                        <button type="submit">Confirm Payment</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Payment;
