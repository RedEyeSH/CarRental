import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faCar,
    faGear,
    faRightFromBracket,
    faClockRotateLeft,
    faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log(storedUser)
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <section className="profile-page">
            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="profile-sidebar-header">
                        <p>My Profile</p>
                    </div>
                    {user && (
                        <div className="profile-sidebar-user">
                            <div className="profile-avatar">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="profile-user-info">
                                <h3>{user.name}</h3>
                                <span className={`profile-role ${user.role?.toLowerCase() || "customer"}`}>
                                    {user.role || "Customer"}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="profile-sidebar-items">
                        <button
                            className={`profile-sidebar-item ${activeSection === "overview" ? "active" : ""}`}
                            onClick={() => setActiveSection("overview")}
                        >
                            <FontAwesomeIcon icon={faAddressCard} />
                            <span>Overview</span>
                        </button>
                        <button
                            className={`profile-sidebar-item ${activeSection === "history" ? "active" : ""}`}
                            onClick={() => setActiveSection("history")}
                        >
                            <FontAwesomeIcon icon={faClockRotateLeft} />
                            <span>Rental History</span>
                        </button>
                        <button
                            className={`profile-sidebar-item ${activeSection === "settings" ? "active" : ""}`}
                            onClick={() => setActiveSection("settings")}
                        >
                            <FontAwesomeIcon icon={faGear} />
                            <span>Settings</span>
                        </button>
                        <button
                            className="profile-sidebar-item logout"
                            onClick={handleLogout}
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="profile-main">
                    {activeSection === "overview" && (
                        <div className="profile-section">
                            <h2>Account Overview</h2>
                            {user ? (
                                <div className="profile-overview">
                                    <div className="profile-summary-card">
                                        <div className="profile-summary-left">
                                            <div className="profile-avatar large">
                                                <FontAwesomeIcon icon={faUser} />
                                            </div>
                                            <div>
                                                <h3>{user.name}</h3>
                                                <span className={`profile-role ${user.role?.toLowerCase() || "customer"}`}>
                                                    {user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "Customer"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="profile-info-grid">
                                        <div className="info-card">
                                            <FontAwesomeIcon icon={faAddressCard} className="info-icon" />
                                            <div>
                                                <p className="info-label">Full Name</p>
                                                <p className="info-value">{user.name}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <FontAwesomeIcon icon={faUser} className="info-icon" />
                                            <div>
                                                <p className="info-label">Email Address</p>
                                                <p className="info-value">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <FontAwesomeIcon icon={faGear} className="info-icon" />
                                            <div>
                                                <p className="info-label">Phone Number</p>
                                                <p className="info-value">{user.phone || "Not provided"}</p>
                                            </div>
                                        </div>
                                        <div className="info-card">
                                            <FontAwesomeIcon icon={faClockRotateLeft} className="info-icon" />
                                            <div>
                                                <p className="info-label">Last Login</p>
                                                <p className="info-value">
                                                    {user.last_login
                                                        ? new Date(user.last_login).toLocaleDateString()
                                                        : "Unknown"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    )}

                    {activeSection === "history" && (
                        <div className="profile-section">
                            <h2>Rental History</h2>
                            <div className="profile-history">
                                {user.rentals?.length ? (
                                    user.rentals.map((rental, index) => (
                                        <div key={index} className="profile-history-card">
                                            <div className="history-icon">
                                                <FontAwesomeIcon icon={faCar} />
                                            </div>
                                            <div className="history-info">
                                                <h4>{rental.carModel}</h4>
                                                <p><strong>Rented:</strong> {rental.startDate} to {rental.endDate}</p>
                                                <p><strong>Total:</strong> €{rental.total}</p>
                                                {rental.status && <p className={`rental-status ${rental.status.toLowerCase()}`}>{rental.status}</p>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No rental history available.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeSection === "settings" && (
                        <div className="profile-section">
                            <h2>Settings</h2>
                            <p>Maybe here goes user edit data</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Profile;
