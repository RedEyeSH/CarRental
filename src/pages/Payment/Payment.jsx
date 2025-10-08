import React, { useState, useEffect, useMemo, useContext } from "react";
import "./Payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCheckCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const { car, startDate: initialStartDate, endDate: initialEndDate } = location.state || {};

    const [startDate, setStartDate] = useState(initialStartDate || "");
    const [endDate, setEndDate] = useState(initialEndDate || "");
    const [payment, setPayment] = useState({ method: "Card", status: "Pending" });
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        if (!car) navigate("/");
    }, [car, navigate]);

    const totalDays = useMemo(() => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    }, [startDate, endDate]);

    const totalPrice = useMemo(() => {
        return car ? (totalDays * parseFloat(car.price_per_day)).toFixed(2) : 0;
    }, [car, totalDays]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) return alert("Please select both start and end dates.");
        if (!user || !user.id) return alert("User not logged in. Please log in to continue.");

        try {
            const token = localStorage.getItem("token");

            const methodMap = {
                "Card": "CARD",
                "Cash": "CASH",
                "Online": "ONLINE"
            };
            const selectedMethod = methodMap[payment.method] || "CARD";
            const paymentStatus = selectedMethod === "CARD" ? "PAID" : "PENDING";

            // Create booking
            const bookingResponse = await fetch("http://localhost:3000/api/v1/bookings", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user.id,
                    car_id: car.id,
                    start_date: startDate,
                    end_date: endDate,
                    total_price: totalPrice,
                    payment_status: paymentStatus
                }),
            });

            if (!bookingResponse.ok) throw new Error("Failed to create booking");
            const bookingData = await bookingResponse.json();

            // Process payment
            const paymentResponse = await fetch("http://localhost:3000/api/v1/payments", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    booking_id: bookingData.id,
                    amount: parseFloat(totalPrice),
                    method: selectedMethod,
                }),
            });

            if (!paymentResponse.ok) throw new Error("Payment failed");
            const paymentData = await paymentResponse.json();

            // Show receipt instead of alert
            setReceipt({
                bookingId: bookingData.id,
                car: `${car.brand} ${car.model} (${car.year})`,
                startDate,
                endDate,
                totalDays,
                totalPrice,
                paymentMethod: payment.method,
                paymentStatus
            });

        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    };

    if (!car) return null;

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

                {/* Payment / Receipt Section */}
                <div className="payment-checkout">
                    {!receipt ? (
                        <>
                            <h2>Payment Details</h2>
                            <form onSubmit={handleSubmit} className="payment-form">
                                <div className="form-group">
                                    <input
                                        type="date"
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
                                    <label>Start Date</label>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="date"
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
                                    <label>End Date</label>
                                </div>
                                <div className="form-group">
                                    <input type="text" value={`${totalDays} day(s)`} readOnly />
                                    <label>Rental Duration</label>
                                </div>
                                <div className="form-group">
                                    <input type="text" value={`€${totalPrice}`} readOnly />
                                    <label>Total Cost</label>
                                </div>
                                <div className="form-group">
                                    <select name="method" value={payment.method} onChange={handleChange}>
                                        <option>Card</option>
                                        <option>Cash</option>
                                        <option>Online</option>
                                    </select>
                                    <label>Payment Method</label>
                                </div>
                                <button type="submit">Confirm Payment</button>
                            </form>
                        </>
                    ) : (
                        <div className="payment-receipt">
                            <div className="success-message">
                                <FontAwesomeIcon icon={faCheckCircle} /> Payment {receipt.paymentStatus === "PAID" ? "Successful!" : "Pending"}
                            </div>
                            <div className="receipt-section">
                                <h3><FontAwesomeIcon icon={faInfoCircle} /> Booking Info</h3>
                                <p><strong>Booking ID:</strong> {receipt.bookingId}</p>
                                <p><strong>Car:</strong> {receipt.car}</p>
                                <p><strong>Rental Period:</strong> {receipt.startDate} → {receipt.endDate}</p>
                                <p><strong>Duration:</strong> {receipt.totalDays} day(s)</p>
                            </div>
                            <div className="receipt-section">
                                <h3><FontAwesomeIcon icon={faInfoCircle} /> Payment Info</h3>
                                <p><strong>Total Paid:</strong> €{receipt.totalPrice}</p>
                                <p><strong>Method:</strong> {receipt.paymentMethod}</p>
                                <p><strong>Status:</strong> {receipt.paymentStatus}</p>
                            </div>
                            <button className="back-home-btn" onClick={() => navigate("/")}>
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Payment;
