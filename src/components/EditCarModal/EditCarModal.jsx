import React from "react";
import "./EditCarModal.css";

const EditCarModal = ({ onClose }) => {
    return (
        <div className="overlay" onClick={onClose}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Car</h2>
            </div>
        </div>
    );
}

export default EditCarModal; 