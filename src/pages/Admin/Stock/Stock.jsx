import React, { useState } from "react";
import "./Stock.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faEllipsis, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import AddCarModal from "../../../components/AddCarModal/AddCarModal.jsx";
import RemoveCarModal from "../../../components/RemoveCarModal/RemoveCarModal.jsx";
import EditCarModal from "../../../components/EditCarModal/EditCarModal.jsx";


const Stock = () => {
    const [toggle, setToggle] = useState("Filter"); 
    const [activeModal, setActiveModal] = useState(null);

    const options = [
        { label: "Filter", icon: faFilter },
        { label: "Add Car", icon: "" },
        { label: "Remove Car", icon: "" },
        { label: "Edit Listing", icon: "" }
    ];

    // Mock data
    const locations = [
        "Helsinki",
        "Tampere",
        "Espoo",
        "Vantaa"
    ];

    return (
        <>
            <section className="stock">
                <div className="stock-container">
                    <div className="stock-sidebar">
                        <h1>Current Stock</h1>
                        {locations.map((location) => (
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
                                <input type="text" id="stock-search" placeholder="Search..." />
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                            <div className="stock-navbar-options">
                                {options.map((option) => (
                                    <div
                                        key={option.label}
                                        className={`stock-navbar-option ${toggle === option.label ? "active" : ""}`}
                                        onClick={() => {
                                            setToggle(option.label)
                                            if (option.label === "Add Car") setActiveModal("add");
                                            else if (option.label === "Remove Car") setActiveModal("remove");
                                            else if (option.label === "Edit Listing") setActiveModal("edit");
                                            else setActiveModal(null);
                                        }}
                                        
                                    >
                                        <p>{option.label}</p>
                                        <FontAwesomeIcon icon={option.icon} />
                                    </div>
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
                                    <tr>
                                        <td>HEL-1</td>
                                        <td>Fiat 500 for 5 days in Helsinki</td>
                                        <td>100€/day</td>
                                        <td><input type="checkbox" /></td>
                                        <td style={{textAlign: "center"}}><FontAwesomeIcon icon={faEllipsis} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
            {activeModal === "add" && <AddCarModal onClose={() => setActiveModal(null)} />}
            {activeModal === "remove" && <RemoveCarModal onClose={() => setActiveModal(null)} />}
            {activeModal === "edit" && <EditCarModal onClose={() => setActiveModal(null)} />}
        </>
    );
}

export default Stock;
