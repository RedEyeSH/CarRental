import React from "react";
import "./AddCarModal.css";

const AddCarModal = ({ onClose }) => {
    return (
        <div className="overlay" onClick={onClose}>
            <div className="add-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Add Car</h2>
            </div>
        </div>
    );
}

export default AddCarModal; 