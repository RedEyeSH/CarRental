import React, { useState, useEffect } from "react";
import "./Payment.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye } from '@fortawesome/free-solid-svg-icons';

const Payment = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [payment, setPayment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        const fetchPayment = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/api/v1/payments/", {
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "",
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch payment");
                const data = await response.json();
                setPayment(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPayment();
    }, []);

    const filteredPayment = payment.filter(txn =>
        (txn.id?.toString().includes(searchTerm) ||
         txn.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         txn.amount?.toString().includes(searchTerm) ||
         txn.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         txn.date?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const showNotification = (message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, exiting: false }]);
        setTimeout(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, exiting: true } : n));
        }, 2500);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const handleViewClick = (txn) => {
        setSelectedTransaction(txn);
        setViewModalOpen(true);
    };

    const handleViewModalClose = () => {
        setViewModalOpen(false);
        setSelectedTransaction(null);
    };

    return (
        <div className="payment-section">
            <h2>Payments</h2>
            <input
                type="text"
                placeholder="Search by user, amount, status, date, or ID"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="payment-search"
            />
            {loading ? (
                <div className="payment-loading">Loading payments...</div>
            ) : error ? (
                <div className="payment-error">{error}</div>
            ) : (
                <table className="payment-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Booking ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Payment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayment.length === 0 ? (
                            <tr><td colSpan="6">No payments found.</td></tr>
                        ) : (
                            filteredPayment.map(txn => (
                                <tr key={txn.id}>
                                    <td>{txn.id}</td>
                                    <td>{txn.booking_id}</td>
                                    <td>{txn.amount}€</td>
                                    <td>{txn.method}</td>
                                    <td>{txn.payment_date ? new Date(txn.payment_date).toLocaleString('en-GB') : "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <div className="notification-container">
                {notifications.map((n, index) => (
                    <div
                        key={n.id}
                        className={`notification ${n.exiting ? "slide-out" : "slide-in"}`}
                        style={{ top: `${index * 60}px` }}
                    >
                        {n.message}
                    </div>
                ))}
            </div>
            {/* View Transaction Modal (to be implemented) */}
            {/* {viewModalOpen && (
                <ViewTransactionModal
                    isOpen={viewModalOpen}
                    onClose={handleViewModalClose}
                    transaction={selectedTransaction}
                />
            )} */}
        </div>
    );
};

export default Payment;
