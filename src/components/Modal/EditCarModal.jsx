import React, { useState, useEffect } from "react";
import "./Modal.css";

const EditCarModal = ({ carData, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: "",
        type: "Sedan",
        license_plate: "",
        status: "AVAILABLE",
        price_per_day: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);

    useEffect(() => {
        if (carData) {
            setFormData({
                brand: carData.brand || "",
                model: carData.model || "",
                year: carData.year || "",
                type: carData.type || "Sedan",
                license_plate: carData.license_plate || "",
                status: carData.status || "AVAILABLE",
                price_per_day: carData.price_per_day || "",
                image: null,
            });
            if (carData.imageUrl) {
                setPreview(carData.imageUrl);
            }
        }
    }, [carData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            setFormData({ ...formData, image: file });
            if (file) setPreview(URL.createObjectURL(file));
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
            const res = await fetch(`http://localhost:3000/api/v1/cars/${carData.id}`, {
                method: "PUT",
                body,
            });

            if (!res.ok) throw new Error("Failed to update car");

            alert("Car updated successfully!");
            onUpdate?.();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error updating car");
        }
    };

    return (
        <>
            <div className="overlay" onClick={onClose}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Edit Car</h2>
                    <form className="car-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                placeholder=" "
                            />
                            <label>Brand</label>
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
                            <label>Model</label>
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
                            <label>Year</label>
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
                            <label>Type</label>
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
                            <label>License Plate</label>
                        </div>

                        <div className="form-group">
                            <select name="status" value={formData.status} onChange={handleChange} required>
                                <option value="" disabled hidden> </option>
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="RENTED">RENTED</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                                <option value="RESERVED">RESERVED</option>
                                <option value="RETIRED">RETIRED</option>
                                <option value="CLEANING">CLEANING</option>
                            </select>
                            <label>Status</label>
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
                            <label>Price per Day</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <label>Upload Image</label>
                        </div>

                        {preview && (
                            <div className="image-preview" onClick={() => setImageModalOpen(true)}>
                                <img src={preview} alt="Car Preview" />
                            </div>
                        )}

                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">Save Changes</button>
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

export default EditCarModal;
