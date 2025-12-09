import React, { useState, useEffect } from "react";
import "./Modal.css";
import { toast } from "react-toastify";

const EditCarModal = ({ carData, onClose, onCarEdited, token }) => {
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: "",
        type: "Sedan",
        license_plate: "",
        status: "",
        price_per_day: "",
        image: null,
        description: "", // added description
    });

    const [preview, setPreview] = useState(null);
    const [originalImage, setOriginalImage] = useState(null); // Store the original image filename
    const [imageModalOpen, setImageModalOpen] = useState(false);

    useEffect(() => {
        if (carData) {
            setFormData({
                brand: carData.brand || "",
                model: carData.model || "",
                year: carData.year || "",
                type: carData.type || "Sedan",
                license_plate: carData.license_plate || "",
                status: carData.status || "",
                price_per_day: carData.price_per_day || "",
                image: null,
                description: carData.description || "", // populate description
            });

            // Set the original image filename if the car data has an image
            if (carData.image) {
                setOriginalImage(carData.image); // Store just the image filename
                setPreview(`http://localhost:3000/public/uploads/${carData.image}`);
            } else {
                setPreview(null);
                setOriginalImage(null);
            }
        }
    }, [carData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files) {
            const file = files[0];
            setFormData((prevData) => ({
                ...prevData,
                image: file,
            }));
            if (file) {
                setPreview(URL.createObjectURL(file)); // Preview the new image
            }
        } else if (name === "status") {
            // If user selects AVAILABLE or RENTED or '-', set status as '-'
            setFormData((prevData) => ({
                ...prevData,
                status: value === "AVAILABLE" || value === "RENTED" || value === "READY" ? "READY" : value,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleCancelImage = () => {
        // Reset to the original image filename if user cancels
        setPreview(`http://localhost:3000/public/uploads/${originalImage}`);
        setFormData((prevData) => ({
            ...prevData,
            image: null, // Clear the new image selection
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = new FormData();

        // Append form data (excluding the image field if no new image is selected)
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "status" && (value === "AVAILABLE" || value === "RENTED")) {
                body.append(key, "READY");
            } else if (value || value === 0) {
                // include falsy number 0
                body.append(key, value);
            }
        });

        // If no new image is selected, append the original image filename (not URL)
        if (!formData.image && originalImage) {
            body.append("image", originalImage); // Send the image filename, not the URL
        }

        // Get the token from localStorage or wherever it's stored
        // Use the token prop if provided, otherwise fallback to localStorage
        const authToken = token || localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:3000/api/v1/cars/${carData.id}`, {
                method: "PUT",
                body,
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                },
            });

            if (!res.ok) {
                const text = await res.text().catch(() => null);
                console.error('EditCarModal: failed to update car', text);
                toast.error(text || "Failed to update car");
                return;
            }

            if (onCarEdited) {
                const updatedCar = await res.json();
                onCarEdited(updatedCar);
            }
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Error updating car");
        }
    };

    return (
        <>
            <div className="overlay" onClick={onClose}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Edit Car</h2>
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
                            <select name="status" value={formData.status === "AVAILABLE" || formData.status === "RENTED" ? "-" : formData.status} onChange={handleChange} required>
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

                        {/* New description field */}
                        <div className="form-group">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder=" "
                                rows={4}
                            />
                            <label htmlFor="description">Description</label>
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

                        {/* Show cancel button only if a new image is selected */}
                        {preview && preview !== `http://localhost:3000/public/uploads/${originalImage}` && (
                            <button type="button" onClick={handleCancelImage} className="cancel-image-btn">
                                Cancel Image
                            </button>
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
