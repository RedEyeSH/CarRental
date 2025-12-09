import React, { useEffect, useState } from "react";
import "./Modal.css";

const ViewCarModal = ({ isOpen, onClose, carId }) => {
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        if (!isOpen || !carId) return;

        setLoading(true);
        setError(null);

        fetch(`http://localhost:3000/api/v1/cars/${carId}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch car data");
                return res.json();
            })
            .then(data => {
                setCar(data);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [isOpen, carId]);

    useEffect(() => {
        if (!isOpen || !carId) return;

        const token = localStorage.getItem("token");
        fetch(`http://localhost:3000/api/v1/feedbacks/`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch feedbacks");
                return res.json();
            })
           .then(data => {
                // Defensive: ensure feedbacks is always an array
                let allFeedbacks = Array.isArray(data) ? data : (data && typeof data === 'object' ? [data] : []);
                // Filter feedbacks for the current car
                const filtered = allFeedbacks.filter(fb => String(fb.car_id) === String(carId));
                setFeedbacks(filtered);
            })
            .catch(err => {
                console.error("Feedback fetch error:", err);
                setFeedbacks([]);
            });
    }, [isOpen, carId]);

    // Calculate average rating
    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedbacks.length).toFixed(1)
        : null;

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ background: 'rgba(24,28,36,0.92)', zIndex: 1000 }}>
            <div className="modal" style={{ maxWidth: 520, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', background: '#23272f', color: '#fff', padding: 0 }}>
                {/* Header */}
                <div style={{ background: '#181c24', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: '24px 32px 16px 32px', textAlign: 'center', borderBottom: '1px solid #2c313a' }}>
                    <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>{car ? `${car.brand} ${car.model}` : 'Car Details'}</h2>
                    <div style={{ fontSize: 16, color: '#1f6feb', marginTop: 4 }}>{car ? car.year : ''}</div>
                </div>
                {/* Car Image */}
                {car && car.image && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#23272f', padding: 24 }}>
                        <img
                            src={`http://localhost:3000/public/uploads/${car.image}`}
                            alt="Car"
                            style={{ width: '100%', maxWidth: 340, maxHeight: 200, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.18)', border: '2px solid #2c313a', objectFit: 'cover', background: '#181c24' }}
                        />
                    </div>
                )}

                {/* Show loading or error messages when fetching car */}
                {loading && (
                    <div style={{ padding: '20px 32px', textAlign: 'center', color: '#cbd5e1' }}>Loading car details...</div>
                )}
                {error && (
                    <div style={{ padding: '20px 32px', textAlign: 'center', color: '#ff9aa2' }}>
                        <strong>Error loading car:</strong> {error}
                    </div>
                )}

                {/* Car Details Grid + Description */}
                {car && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, padding: '0 32px 0 32px', marginTop: 8, marginBottom: 8 }}>
                            <div><span role="img" aria-label="type"></span> <strong>Type:</strong> {car.type}</div>
                            <div><span role="img" aria-label="plate"></span> <strong>License Plate:</strong> {car.license_plate}</div>
                            <div><span role="img" aria-label="status"></span> <strong>Status:</strong> {car.status}</div>
                            <div><span role="img" aria-label="price"></span> <strong>Price/Day:</strong> {car.price_per_day} €</div>
                        </div>

                        {/* Description - full width */}
                        <div style={{ padding: '0 32px 0 32px', marginTop: 4, marginBottom: 8 }}>
                            <h4 style={{ margin: '6px 0', fontSize: 15, color: '#cbd5e1' }}>Description</h4>
                            <div style={{ color: '#e6eef8', lineHeight: 1.4 }}>{car.description ? car.description : <span style={{ color: '#9aa2ad' }}>No description provided.</span>}</div>
                        </div>
                    </>
                )}
                {/* Feedback Section */}
                <div style={{ background: '#181c24', borderRadius: 12, margin: '24px 32px 0 32px', padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 20, fontWeight: 600, letterSpacing: 0.5 }}>Feedback</h3>
                    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22, color: '#f5c518' }}>★</span>
                        <span style={{ fontWeight: 700, fontSize: 18 }}>
                            {averageRating ? `${averageRating} / 5` : 'No ratings yet'}
                        </span>
                        {feedbacks.length > 0 && (
                            <span style={{ color: '#aaa', fontSize: 14 }}>({feedbacks.length} review{feedbacks.length > 1 ? 's' : ''})</span>
                        )}
                    </div>
                    {feedbacks.length === 0 ? (
                        <div style={{ color: '#aaa' }}>No feedback for this car yet.</div>
                    ) : (
                        <ul style={{ maxHeight: 160, overflowY: 'auto', paddingLeft: 0, margin: 0 }}>
                            {feedbacks.map((fb, idx) => (
                                <li key={idx} style={{ listStyle: 'none', marginBottom: 14, background: '#23272f', borderRadius: 8, padding: 12, border: '1px solid #23272f' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ color: '#f5c518', fontWeight: 700, fontSize: 16 }}>★ {fb.rating}</span>
                                        <span style={{ color: '#aaa', fontSize: 12, marginLeft: 8 }}>{new Date(fb.created_at).toLocaleDateString('en-GB')}</span>
                                    </div>
                                    <div style={{ marginTop: 4 }}>{fb.comment}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="modal-actions" style={{ padding: 24, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #2c313a', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                    <button type="button" onClick={onClose} style={{ background: '#1f6feb', color: 'white', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewCarModal;
