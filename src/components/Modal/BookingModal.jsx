import React, { useEffect, useMemo, useState } from "react";
import "./Modal.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BookingModal = ({ car, startDate, endDate, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [carFeedbacks, setCarFeedbacks] = useState([]);
    const [feedbacksLoading, setFeedbacksLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const totalDays = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    }, [startDate, endDate]);

    const totalPrice = useMemo(() => {
        return (totalDays * parseFloat(car.price_per_day)).toFixed(2);
    }, [totalDays, car.price_per_day]);

    // Fetch car feedbacks
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/v1/feedbacks/car/${car.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCarFeedbacks(data);
                }
            } catch (err) {
                console.error("Error fetching feedbacks:", err);
            } finally {
                setFeedbacksLoading(false);
            }
        };
        fetchFeedbacks();
    }, [car.id]);

    // Calculate average rating
    const averageRating = useMemo(() => {
        if (carFeedbacks.length === 0) return 0;
        const sum = carFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
        return (sum / carFeedbacks.length).toFixed(1);
    }, [carFeedbacks]);

    const handleBooking = () => {
        navigate("/payment", {
            state: {
                car,
                startDate,
                endDate,
                totalDays,
                totalPrice,
            },
        });
    };

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal-home" onClick={(e) => e.stopPropagation()}>
                <h2>{t("BookingModal.confirmBooking")}</h2>
                <div className="booking-details-card">
                    <div className="booking-details-header">
                        <div className="booking-car-image-wrapper">
                            <img
                                src={`http://localhost:3000/public/uploads/${car.image}`}
                                alt={`${car.brand} ${car.model}`}
                                className="booking-car-image"
                            />
                        </div>
                        <div className="booking-main-info">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                <h3 style={{ margin: 0 }}>{car.brand} {car.model}</h3>
                                {!feedbacksLoading && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <FontAwesomeIcon icon={faStar} style={{ color: '#ffc107', fontSize: 14 }} />
                                        <span style={{ fontSize: 13, color: '#8b949e', whiteSpace: 'nowrap' }}>
                                            {averageRating > 0 ? `${averageRating} (${carFeedbacks.length})` : t("BookingModal.noReviews")}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="booking-label">
                                <strong>{t("BookingModal.pricePerDay")}:</strong> <span>€{car.price_per_day}</span>
                            </p>
                            <p className="booking-label">
                                <strong>{t("BookingModal.days")}:</strong> <span>{totalDays} {totalDays > 1 ? t("BookingModal.daysPlural") : t("BookingModal.days")}</span>
                            </p>
                            {car.description && (
                                <div className="booking-description">
                                    <label className="booking-description-label">{t("BookingModal.description")}:</label>
                                    <p className="booking-description-text">{car.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="booking-details-body">
                        <p className="booking-label">
                            <strong>{t("BookingModal.to")}:</strong> <span>{startDate}</span>
                        </p>
                        <p className="booking-label">
                            <strong>{t("BookingModal.from")}:</strong> <span>{endDate}</span>
                        </p>
                    </div>
                    <div className="booking-total">
                        <span className="total-label">{t("BookingModal.totalPrice")}:</span>
                        <span className="total-amount">€{totalPrice}</span>
                    </div>
                </div>
                <div className="booking-modal-buttons">
                    <button className="booking-cancel-btn" onClick={onClose}>
                        {t("BookingModal.cancel")}
                    </button>
                    <button className="booking-confirm-btn" onClick={handleBooking}>
                        {t("BookingModal.confirmBooking")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
