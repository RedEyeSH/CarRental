import React, { useMemo } from "react";
import "./Modal.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BookingModal = ({ car, startDate, endDate, onClose }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const totalDays = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    }, [startDate, endDate]);

    const totalPrice = useMemo(() => {
        return totalDays * parseFloat(car.price_per_day || 0);
    }, [totalDays, car.price_per_day]);

    const handleBooking = () => {
        onClose(); // Close modal first
        navigate("/payment", {
            state: {
                car,
                startDate,
                endDate,
                totalPrice,
            },
        });
    };

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="booking-modal-title">{t("BookingModal.title")}</h2>

                <div className="booking-details-card">
                    <div className="booking-details-header">
                        <div className="booking-car-image-wrapper">
                            <img
                                src={`http://localhost:3000/public/uploads/${car.image}`}
                                alt={`${car.brand} ${car.model}`}
                                className="booking-car-image"
                                draggable={false}
                            />
                        </div>
                        <div className="booking-main-info">
                            <h3>{car.brand} {car.model}</h3>
                            <p className="booking-label">
                                <strong>{t("BookingModal.pricePerDay")}:</strong> <span>€{car.price_per_day}</span>
                            </p>
                            <p className="booking-label">
                                <strong>{t("BookingModal.days")}:</strong> <span>{totalDays} {totalDays > 1 ? t("BookingModal.daysPlural") : t("BookingModal.days")}</span>
                            </p>
                        </div>
                    </div>

                    <div className="booking-details-body">
                        <p className="booking-label">
                            <strong>{t("BookingModal.from")}:</strong> <span>{startDate}</span>
                        </p>
                        <p className="booking-label">
                            <strong>{t("BookingModal.to")}:</strong> <span>{endDate}</span>
                        </p>
                        <div className="booking-total">
                            <p className="total-label">{t("BookingModal.totalPrice")}:</p>
                            <p className="total-amount">€{totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
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
