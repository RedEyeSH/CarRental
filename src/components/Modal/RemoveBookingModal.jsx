import React from "react";
import "./Modal.css";

const RemoveBookingModal = ({ booking, onCancel, onConfirm }) => {
    return (
        <div className="overlay" onClick={onCancel}>
            <div className="remove-modal" onClick={e => e.stopPropagation()}>
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete booking <span>#{booking.id}</span>?</p>
                <div className="modal-actions">
                    <button type="button" className="cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className="confirm" onClick={() => onConfirm(booking.id)}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveBookingModal;
