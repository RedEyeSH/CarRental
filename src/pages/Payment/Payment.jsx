import React, { useState, useEffect, useMemo, useContext } from "react";
import "./Payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCheckCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

import { useTranslation } from "react-i18next";

const Payment = () => {
    const { t } = useTranslation();

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
        if (!startDate || !endDate) return alert(t("payment.alerts.dateRequired"));
        if (!user || !user.id) return alert(t("payment.alerts.userNotLoggedIn"));

        try {
            const token = localStorage.getItem("token");

            const methodMap = {
                [t("payment.methodCard")]: "CARD",
                [t("payment.methodCash")]: "CASH",
                [t("payment.methodOnline")]: "ONLINE",
            };
            const selectedMethod = methodMap[payment.method] || "CARD";
            const paymentStatus = selectedMethod === "CARD" ? "PAID" : "PENDING";

            const bookingResponse = await fetch("http://localhost:3000/api/v1/bookings", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: user.id,
                    car_id: car.id,
                    start_date: startDate,
                    end_date: endDate,
                    total_price: totalPrice,
                    payment_status: paymentStatus,
                }),
            });

            if (!bookingResponse.ok) throw new Error(t("payment.alerts.paymentFailed"));
            const bookingData = await bookingResponse.json();

            const paymentResponse = await fetch("http://localhost:3000/api/v1/payments", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    booking_id: bookingData.id,
                    amount: parseFloat(totalPrice),
                    method: selectedMethod,
                }),
            });

            if (!paymentResponse.ok) throw new Error(t("payment.alerts.paymentFailed"));
            const paymentData = await paymentResponse.json();

            setReceipt({
                bookingId: bookingData.id,
                car: `${car.brand} ${car.model} (${car.year})`,
                startDate,
                endDate,
                totalDays,
                totalPrice,
                paymentMethod: payment.method,
                paymentStatus,
            });

        } catch (error) {
            console.error(error);
            alert(t("payment.alerts.paymentFailed"));
        }
    };

    if (!car) return null;

    return (
        <section className="payment">
            <div className="payment-header">
                <h1>
                    <FontAwesomeIcon icon={faCreditCard} /> {t("payment.checkout")}
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
                        <p>€{car.price_per_day} / {t("payment.rentalDuration")}</p>
                    </div>
                </div>

                <div className="payment-checkout">
                    {!receipt ? (
                        <>
                            <h2>{t("payment.paymentDetails")}</h2>
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
                                    <label>{t("payment.startDate")}</label>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            const newEnd = e.target.value;
                                            if (startDate && new Date(newEnd) < new Date(startDate)) {
                                                alert(t("payment.alerts.invalidDate"));
                                                return;
                                            }
                                            setEndDate(newEnd);
                                        }}
                                        required
                                    />
                                    <label>{t("payment.endDate")}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text" value={`${totalDays} ${t("payment.rentalDuration")}`} readOnly />
                                    <label>{t("payment.rentalDuration")}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text" value={`€${totalPrice}`} readOnly />
                                    <label>{t("payment.totalCost")}</label>
                                </div>
                                <div className="form-group">
                                    <select name="method" value={payment.method} onChange={handleChange}>
                                        <option>{t("payment.methodCard")}</option>
                                        <option>{t("payment.methodCash")}</option>
                                        <option>{t("payment.methodOnline")}</option>
                                    </select>
                                    <label>{t("payment.paymentMethod")}</label>
                                </div>
                                <button type="submit">{t("payment.confirmPayment")}</button>
                            </form>
                        </>
                    ) : (
                        <div className="payment-receipt">
                            <div className="success-message">
                                <FontAwesomeIcon icon={faCheckCircle} /> {receipt.paymentStatus === "PAID" ? t("payment.paymentSuccessful") : t("payment.paymentPending")}
                            </div>
                            <div className="receipt-section">
                                <h3><FontAwesomeIcon icon={faInfoCircle} /> {t("payment.bookingInfo")}</h3>
                                <p><strong>{t("payment.bookingId")}:</strong> {receipt.bookingId}</p>
                                <p><strong>{t("payment.car")}:</strong> {receipt.car}</p>
                                <p><strong>{t("payment.rentalPeriod")}:</strong> {receipt.startDate} → {receipt.endDate}</p>
                                <p><strong>{t("payment.duration")}:</strong> {receipt.totalDays} {t("payment.rentalDuration")}</p>
                            </div>
                            <div className="receipt-section">
                                <h3><FontAwesomeIcon icon={faInfoCircle} /> {t("payment.paymentInfo")}</h3>
                                <p><strong>{t("payment.totalPaid")}:</strong> €{receipt.totalPrice}</p>
                                <p><strong>{t("payment.method")}:</strong> {receipt.paymentMethod}</p>
                                <p><strong>{t("payment.status")}:</strong> {receipt.paymentStatus === "PAID" ? t("payment.paymentSuccessful") : t("payment.paymentPending")}</p>
                            </div>
                            <button className="back-home-btn" onClick={() => navigate("/")}>
                                {t("payment.backHome")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Payment;
