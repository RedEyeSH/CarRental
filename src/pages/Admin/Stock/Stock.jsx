import { useState } from "react";
import "./Stock.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

const Stock = () => {
    const [toggle, setToggle] = useState("Filter"); 

    const options = [
        { label: "Filter", icon: faFilter },
        { label: "Add Car", icon: faFilter },
        { label: "Remove Car", icon: faFilter },
        { label: "Edit Listing", icon: faFilter }
    ];

    return (
        <section className="stock">
            <div className="stock-container">
                <div className="stock-sidebar">
                    <h1>Current Stock</h1>
                    <div className="stock-sidebar-item">
                        <div className="stock-icon-wrapper">
                            <FontAwesomeIcon icon={faCircle} />
                        </div>
                        <p>Helsinki</p>
                    </div>           
                    <div className="stock-sidebar-item">
                        <div className="stock-icon-wrapper">
                            <FontAwesomeIcon icon={faCircle} />
                        </div>
                        <p>Tampere</p>
                    </div>           
                    <div className="stock-sidebar-item">
                        <div className="stock-icon-wrapper">
                            <FontAwesomeIcon icon={faCircle} />
                        </div>
                        <p>Espoo</p>
                    </div>           
                    <div className="stock-sidebar-item">
                        <div className="stock-icon-wrapper">
                            <FontAwesomeIcon icon={faCircle} />
                        </div>
                        <p>Vantaa</p>
                    </div>           
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
                                    onClick={() => setToggle(option.label)}
                                >
                                    <p>{option.label}</p>
                                    <FontAwesomeIcon icon={option.icon} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="stock-list">

                    </div>
                </div>
            </div>
        </section>
    );
}

export default Stock;
