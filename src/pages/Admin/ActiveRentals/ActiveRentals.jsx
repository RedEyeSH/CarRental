import { useState } from "react";
import "./ActiveRentals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faEllipsis, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

const ActiveRentals = () => {
    const [toggle, setToggle] = useState("Filter"); 

    const options = [
        { label: "Filter", icon: faFilter },
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
        <section className="rental">
            <div className="rental-container">
                <div className="rental-sidebar">
                    <h1>Active Rentals</h1>
                    {locations.map((location) => (
                        <div className="rental-sidebar-item">
                            <div className="rental-icon-wrapper">
                                <FontAwesomeIcon icon={faCircle} />
                            </div>
                            <p>{location}</p>
                        </div>
                    ))}
                </div>
                <div className="rental-main">
                    <div className="rental-navbar">
                        <div className="rental-navbar-search">
                            <input type="text" id="rental-search" placeholder="Search..." />
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <div className="rental-navbar-options">
                            {options.map((option) => (
                                <div
                                    key={option.label}
                                    className={`rental-navbar-option ${toggle === option.label ? "active" : ""}`}
                                    onClick={() => setToggle(option.label)}
                                >
                                    <p>{option.label}</p>
                                    <FontAwesomeIcon icon={option.icon} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rental-list">
                        <table className="rental-table">
                            <thead>
                                <tr>
                                    <th>City</th>
                                    <th>Title</th>
                                    <th>Start-Date</th>
                                    <th>End-Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>HEL-1</td>
                                    <td>Fiat 500 for 5 days in Helsinki</td>
                                    <td style={{color: "#777"}}>Dec 5</td>
                                    <td style={{color: "#777"}}>Dec 10</td>
                                    <td style={{textAlign: "center"}}><FontAwesomeIcon icon={faEllipsis} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ActiveRentals;