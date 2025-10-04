import React, { useState, useEffect, useRef } from "react";
import "./Stock.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faEllipsis, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import AddCarModal from "../../../components/Modal/AddCarModal.jsx";
import EditCarModal from "../../../components/Modal/EditCarModal.jsx";
import RemoveCarModal from "../../../components/Modal/RemoveCarModal.jsx";

const Stock = () => {
    const [toggle, setToggle] = useState("Filter"); 
    const [searchTerm, setSearchTerm] = useState("");

    const [activeModal, setActiveModal] = useState(null);
    const [removeModal, setRemoveModal] = useState(null);
    const [activeEllipsis, setActiveEllipsis] = useState(null);

    const [notifications, setNotifications] = useState([]);

    const dropdownRef = useRef(null);

    const options = [
        { label: "Filter", icon: faFilter },
        { label: "Add Car", icon: "" },
    ];

    const [stockData, setStockData] = useState([
        { id: 1, city: "HEL-1", title: "Fiat 500 for 5 days in Helsinki", price: "100€/day", available: true },
        { id: 2, city: "TAMP-2", title: "Toyota Corolla for 3 days in Tampere", price: "120€/day", available: true },
    ]);

    const filteredStockData = stockData.filter(car =>
        car.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEllipsisClick = (carId) => {
        setActiveEllipsis(prev => (prev === carId ? null : carId));
    };

    const handleEditClick = (car) => {
        setActiveModal({ type: "edit", data: car });
        setActiveEllipsis(null);
    };

    const handleCarAdded = (newCar) => {
        setStockData(prev => [...prev, newCar]);
        showNotification("Car added successfully!");
    };

    const showNotification = (message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, exiting: false }]);

        setTimeout(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, exiting: true } : n));
        }, 2500);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const handleDeleteConfirm = (carId) => {
        setStockData(prev => prev.filter(car => car.id !== carId));
        setRemoveModal(null);
        showNotification("Item successfully deleted!");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveEllipsis(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <section className="stock">
                <div className="notification-container">
                    {notifications.map((n, index) => (
                        <div
                            key={n.id}
                            className={`notification ${n.exiting ? "slide-out" : "slide-in"}`}
                            style={{ top: `${index * 60}px` }}
                        >
                            {n.message}
                        </div>
                    ))}
                </div>
                <div className="stock-container">
                    <div className="stock-sidebar">
                        <h1>Current Stock</h1>
                        {["Helsinki", "Tampere", "Espoo", "Vantaa"].map(location => (
                            <div key={location} className="stock-sidebar-item">
                                <div className="stock-icon-wrapper">
                                    <FontAwesomeIcon icon={faCircle} />
                                </div>
                                <p>{location}</p>
                            </div>
                        ))}
                    </div>
                    <div className="stock-main">
                        <div className="stock-navbar">
                            <div className="stock-navbar-search">
                                <input
                                    type="text"
                                    id="stock-search"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                            <div className="stock-navbar-options">
                            {options.map(option => (
                                <button
                                    key={option.label}
                                    className={`stock-navbar-option ${
                                        option.label === "Filter" && toggle === "Filter" ? "active" : ""
                                    }`}
                                    onClick={() => {
                                        if (option.label === "Filter") {
                                        setToggle(prev => (prev === "Filter" ? "" : "Filter"));
                                        } else if (option.label === "Add Car") {
                                        setActiveModal({ type: "add" });
                                        }
                                    }}
                                    >
                                    <p>{option.label}</p>
                                    <FontAwesomeIcon icon={option.icon} />
                                </button>
                            ))}
                            </div>
                        </div>

                        <div className="stock-list">
                            <table className="stock-table">
                                <thead>
                                    <tr>
                                        <th>City</th>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Availability</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStockData.map(car => (
                                        <tr key={car.id}>
                                            <td>{car.city}</td>
                                            <td>{car.title}</td>
                                            <td>{car.price}</td>
                                            <td><input type="checkbox" checked={car.available} readOnly /></td>
                                            <td style={{ position: "relative", textAlign: "center" }}>
                                                <FontAwesomeIcon
                                                    icon={faEllipsis}
                                                    onClick={() => handleEllipsisClick(car.id)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                {activeEllipsis === car.id && (
                                                    <div className="ellipsis-dropdown" ref={dropdownRef}>
                                                        <p onClick={() => handleEditClick(car)}>Edit Item</p>
                                                        <p onClick={() => { setRemoveModal(car); setActiveEllipsis(null); }}>Delete Item</p>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {activeModal?.type === "add" && (
                <AddCarModal 
                    onClose={() => setActiveModal(null)} 
                    onCarAdded={handleCarAdded} 
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
                        showNotification("Car updated successfully!");
                    }}
                />
            )}

            {removeModal && (
                <RemoveCarModal
                    car={removeModal}
                    onCancel={() => setRemoveModal(null)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </>
    );
};

export default Stock;
