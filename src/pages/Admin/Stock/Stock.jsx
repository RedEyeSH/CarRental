import React, { useState, useEffect } from "react";
import "./Stock.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faPlus, faLanguage } from '@fortawesome/free-solid-svg-icons';
import AddCarModal from "../../../components/Modal/AddCarModal.jsx";
import EditCarModal from "../../../components/Modal/EditCarModal.jsx";
import RemoveCarModal from "../../../components/Modal/RemoveCarModal.jsx";
import ViewCarModal from "../../../components/Modal/ViewCarModal.jsx";
import AddCarTranslationModal from "../../../components/Modal/AddCarTranslationModal.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Stock = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeModal, setActiveModal] = useState(null);
    const [removeModal, setRemoveModal] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedCarToView, setSelectedCarToView] = useState(null);
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [translationModalCar, setTranslationModalCar] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:3000/api/v1/cars/");
                if (!response.ok) throw new Error("Failed to fetch cars");
                const data = await response.json();
                setStockData(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const filteredStockData = stockData.filter(car =>
        (car.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.year?.toString().includes(searchTerm) ||
            car.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.status?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEditClick = (car) => {
        setActiveModal({ type: "edit", data: car });
    };

    const handleCarAdded = (newCar) => {
        setStockData(prev => [...prev, newCar]);
        toast.success("Car added successfully!");
    };

    const handleDeleteConfirm = async (carId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/v1/cars/${carId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to delete car");
            setStockData(prev => prev.filter(car => car.id !== carId));
            setRemoveModal(null);
            toast.success("Item successfully deleted!");
        } catch (err) {
            setRemoveModal(null);
            toast.error("Failed to delete item!");
        }
    };

    const handleViewClick = (carId) => {
        setSelectedCarToView(carId);
        setViewModalOpen(true);
    };

    const handleViewModalClose = () => {
        setViewModalOpen(false);
        setSelectedCarToView(null);
    };

    const token = localStorage.getItem("token");

    return (
        <div className="stock-section">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
 
            <h2>Stock</h2>
            <div className="stock-header-bar">
                <input
                    type="text"
                    placeholder="Search by brand, model, license plate, ..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="stock-search"
                />
                <button
                    className="stock-add-btn"
                    onClick={() => setActiveModal({ type: "add" })}
                >
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} /> Add Car
                </button>
            </div>
            {loading ? (
                <div className="stock-loading">Loading cars...</div>
            ) : error ? (
                <div className="stock-error">{error}</div>
            ) : (
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>Type</th>
                            <th>License Plate</th>
                            <th>Status</th>
                            <th>Price/Day</th>
                            <th>Image</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStockData.length === 0 ? (
                            <tr><td colSpan="11">No cars found.</td></tr>
                        ) : (
                            filteredStockData.map(car => (
                                <tr key={car.id}>
                                    <td>{car.id}</td>
                                    <td>{car.brand}</td>
                                    <td>{car.model}</td>
                                    <td>{car.year}</td>
                                    <td>{car.type}</td>
                                    <td>{car.license_plate}</td>
                                    <td>
                                        <span className={`badge badge-${(car.status || '').toLowerCase().replace(/\s/g, '-')}`}>{car.status}</span>
                                    </td>
                                    <td>{car.price_per_day}€</td>
                                    <td>
                                        {car.image ? (
                                            <img
                                                src={`http://localhost:3000/public/uploads/${car.image}`}
                                                alt="car"
                                                style={{ width: 60, borderRadius: 4 }}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        {car.created_at
                                            ? new Date(car.created_at).toLocaleString('en-GB', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })
                                            : "-"}
                                    </td>
                                    <td style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>

                                    <button className="stock-icon-btn" title="View" onClick={() => handleViewClick(car.id)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className="stock-icon-btn" title="Edit" onClick={() => handleEditClick(car)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="stock-icon-btn" title="Delete" onClick={() => setRemoveModal(car)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                        <button className="stock-icon-btn" title="Add Translation" onClick={() => setTranslationModalCar(car.id)}>
                                            <FontAwesomeIcon icon={faLanguage} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            {activeModal && activeModal.type === "add" && (
                <AddCarModal
                    onClose={() => setActiveModal(null)}
                    onCarAdded={handleCarAdded}
                    token={token}
                />
            )}
            {activeModal?.type === "edit" && (
                <EditCarModal
                    carData={activeModal.data}
                    onClose={() => setActiveModal(null)}
                    onCarEdited={(updatedCar) => {
                        setStockData(prev =>
                            prev.map(car => car.id === updatedCar.id ? updatedCar : car)
                        );
                         toast.success("Car updated successfully!");
                    }}
                    token={token}
                />
            )}
            {removeModal && (
                <RemoveCarModal
                    car={removeModal}
                    onCancel={() => setRemoveModal(null)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
            <ViewCarModal
                isOpen={viewModalOpen}
                onClose={handleViewModalClose}
                carId={selectedCarToView}
            />
            {translationModalCar && (
                <AddCarTranslationModal
                    onClose={() => setTranslationModalCar(null)}
                    carId={translationModalCar}
                    token={token}
                    onTranslationAdded={(created) => {
                        setTranslationModalCar(null);
                    }}
                />
            )}
        </div>
    );
};

export default Stock;
