import React, { useState, useEffect } from "react";
import "./Payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faCreditCard } from "@fortawesome/free-solid-svg-icons";

const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newPayment, setNewPayment] = useState({
        bookingId: "",
        amount: "",
        status: "Pending",
        method: "Credit Card"
    });

    useEffect(() => {
        fetch("/api/v1/payments")
            .then(res => res.json())
            .then(data => {
                setPayments(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch payments.");
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPayment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/api/v1/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPayment)
        })
            .then(res => res.json())
            .then(data => {
                setPayments(prev => [...prev, data]);
                setShowForm(false);
                setNewPayment({ bookingId: "", amount: "", status: "Pending", method: "Credit Card" });
            })
            .catch(() => setError("Failed to create payment."));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this payment?")) return;

        fetch(`/api/v1/payments/${id}`, { method: "DELETE" })
            .then(() => setPayments(prev => prev.filter(p => p.id !== id)))
            .catch(() => setError("Failed to delete payment."));
    };

    if (loading) return <p>Loading payments...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <section className="payment">
            <div className="payment-header">
                <h1><FontAwesomeIcon icon={faCreditCard} /> Payments</h1>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                    <FontAwesomeIcon icon={faPlus} /> Add Payment
                </button>
            </div>

            {showForm && (
                <form className="payment-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="bookingId"
                        placeholder="Booking ID"
                        value={newPayment.bookingId}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={newPayment.amount}
                        onChange={handleChange}
                        required
                    />
                    <select name="status" value={newPayment.status} onChange={handleChange}>
                        <option>Pending</option>
                        <option>Completed</option>
                        <option>Failed</option>
                    </select>
                    <select name="method" value={newPayment.method} onChange={handleChange}>
                        <option>Credit Card</option>
                        <option>PayPal</option>
                        <option>Bank Transfer</option>
                    </select>
                    <button type="submit">Submit</button>
                </form>
            )}

            <table className="payment-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Booking ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id}>
                            <td>{payment.id}</td>
                            <td>{payment.bookingId}</td>
                            <td>€{payment.amount}</td>
                            <td>{payment.status}</td>
                            <td>{payment.method}</td>
                            <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                            <td>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="delete-icon"
                                    onClick={() => handleDelete(payment.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default Payment;
