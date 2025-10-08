import React, { useState } from "react";
import "./Modal.css";
import { toast } from "react-toastify";

const AddCarModal = ({ onClose, onCarAdded, token, onShowNotification }) => {
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: "",
        type: "Sedan",
        license_plate: "",
        status: "READY",
        price_per_day: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            setFormData({ ...formData, image: file });
            if (file) {
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) body.append(key, value);
        });

        try {
            const res = await fetch("http://localhost:3000/api/v1/cars", {
                method: "POST",
                body,
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (!res.ok) throw new Error("Failed to add car");

            if (onCarAdded) {
                const newCar = await res.json();
                onCarAdded(newCar);
            }
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Error adding car");
        }
    };

    return (
        <>
            <div className="overlay" onClick={onClose}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Add Car</h2>
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                placeholder=" "
                            />
                            <label htmlFor="brand">Brand</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                required
                                placeholder=" "
                            />
                            <label htmlFor="model">Model</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                placeholder=" "
                            />
                            <label htmlFor="year">Year</label>
                        </div>

                        <div className="form-group">
                            <select name="type" value={formData.type} onChange={handleChange} required>
                                <option value="" disabled hidden> </option>
                                <option value="Sedan">Sedan</option>
                                <option value="Jeep">Jeep</option>
                                <option value="SUV">SUV</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Truck">Truck</option>
                                <option value="Coupe">Coupe</option>
                            </select>
                            <label htmlFor="type">Type</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="license_plate"
                                value={formData.license_plate}
                                onChange={handleChange}
                                required
                                placeholder=" "
                            />
                            <label htmlFor="license_plate">License Plate</label>
                        </div>

                        <div className="form-group">
                            <select name="status" value={formData.status} onChange={handleChange} required>
                                <option value="" disabled hidden> </option>
                                <option value="READY">READY</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                                <option value="RESERVED">RESERVED</option>
                                <option value="RETIRED">RETIRED</option>
                                <option value="CLEANING">CLEANING</option>
                            </select>
                            <label htmlFor="status">Status</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="number"
                                name="price_per_day"
                                value={formData.price_per_day}
                                onChange={handleChange}
                                required
                                placeholder=" "
                            />
                            <label htmlFor="price_per_day">Price per Day</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <label htmlFor="image">Upload Image</label>
                        </div>

                        {preview && (
                            <div className="image-preview" onClick={() => setImageModalOpen(true)}>
                                <img src={preview} alt="Car Preview" />
                            </div>
                        )}

                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">Add Car</button>
                        </div>
                    </form>
                </div>
            </div>
            {imageModalOpen && (
                <div
                    className="fullscreen-overlay"
                    onClick={() => setImageModalOpen(false)}
                >
                    <img src={preview} alt="Fullscreen Preview" />
                </div>
            )}
        </>
    );
};

export default AddCarModal;
