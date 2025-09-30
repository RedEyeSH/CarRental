import React from "react";
import "./RemoveCarModal.css";

const RemoveCarModal = ({ onClose }) => {
    return (
        <div className="overlay" onClick={onClose}>
            <div className="add-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Remove Car</h2>
            </div>
        </div>
    );
}

export default RemoveCarModal; 