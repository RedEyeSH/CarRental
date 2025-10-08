import React, { useState } from "react";
import "./Admin.css";
// import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTruckFast, faGear, faCircleUser, faHome, faSquarePollVertical, faBook, faCreditCard, faComment } from "@fortawesome/free-solid-svg-icons";
// import KPICard from "../../components/KPICard/KPICard.jsx";
// import LineChart from "../../components/LineChart/LineChart.jsx";
// import { kpiData, LineChartData } from "../../data/mockData.js";
import Dashboard from "./Dashboard/Dashboard.jsx";
import Stock from "./Stock/Stock.jsx";
import Rental from "./ActiveRentals/ActiveRentals.jsx";
import Booking from "./Booking/Booking.jsx";
import Users from "./Users/Users.jsx";
import Feedback from "./Feedback/Feedback.jsx"
import { Link } from "react-router-dom";
import LoginModal from "../../components/Modal/LoginModal.jsx";
import Payment from "./Payment/Payment.jsx";

const Admin = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        try {
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [showLogin, setShowLogin] = useState(!user || user.role !== "ADMIN");

    const handleLogin = (userData) => {
        setUser(userData);
        setShowLogin(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setShowLogin(true);
    };

    if (showLogin) {
        return <LoginModal isOpen={true} onLogin={handleLogin} />;
    }

    return (
        <section className="admin">
            <div className="admin-container">
                <div className="admin-sidebar">
                    <div className="admin-sidebar-header">
                        <p>Admin Page</p>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <div className="admin-sidebar-profile">
                        <FontAwesomeIcon icon={faCircleUser} />
                        <div className="admin-sidebar-profile-name">
                            <h2>{user?.name || "Username"}</h2>
                            <p>{user?.role || "Admin"}</p>
                        </div>
                    </div>
                    <div className="admin-sidebar-items">
                        <Link
                            to="/"
                            className="admin-sidebar-data"
                        >
                            <div className="admin-icon-wrapper">
                                <FontAwesomeIcon icon={faHome} />
                            </div>
                            <span>Home</span>
                        </Link>
                        <button
                            className={`admin-sidebar-data ${activeSection === "dashboard" ? "active" : ""}`}
                            onClick={() => setActiveSection("dashboard")}
                        >
                            <div className="admin-icon-wrapper">
                                <FontAwesomeIcon icon={faSquarePollVertical} />
                            </div>
                            <span>Dashboard</span>
                        </button>
                        <div className="admin-sidebar-datas">
                            <p>Data</p>
                            {/* <Link to="/admin/rental" className="admin-sidebar-data">
                                <div className="admin-icon-wrapper">
                                    <FontAwesomeIcon icon={faBars} />
                                </div>
                                <span>Active rentals</span>
                            </Link>
                            <Link to="/admin/stock" className="admin-sidebar-data">
                                <div className="admin-icon-wrapper">
                                    <FontAwesomeIcon icon={faTruckFast} />
                                </div>
                                <span>Current Stock</span>
                            </Link> */}
                            <button
                                className={`admin-sidebar-data ${activeSection === "rental" ? "active" : ""}`}
                                onClick={() => setActiveSection("rental")}
                            >
                                <div className="admin-icon-wrapper">
                                    <FontAwesomeIcon icon={faBars} />
                                </div>
                                <span>Active rentals</span>
                            </button>
                            <button
                                className={`admin-sidebar-data ${activeSection === "stock" ? "active" : ""}`}
                                onClick={() => setActiveSection("stock")}
                            >
                                <div className="admin-icon-wrapper">
                                    <FontAwesomeIcon icon={faTruckFast} />
                                </div>
                                <span>Current Stock</span>
                            </button>
                            <button
                                className={`admin-sidebar-data ${activeSection === "booking" ? "active" : ""}`}
                                onClick={() => setActiveSection("booking")}
                            >
                                <div className="admin-icon-wrapper">
                                    <FontAwesomeIcon icon={faBook} />
                                </div>
                                <span>Booking</span>
                            </button>
                            <button
                                className={`admin-sidebar-data ${activeSection === "payment" ? "active" : ""}`}
                                onClick={() => setActiveSection("payment")}
                            >
                                <div className="admin-icon-wrapper">
                                    <FontAwesomeIcon icon={faCreditCard} />
                                </div>
                                <span>Payment</span>
                            </button>
                            <button
                                className={`admin-sidebar-data ${activeSection === "users" ? "active" : ""}`}
                                onClick={() => setActiveSection("users")}
                            >
                                <div className="admin-icon-wrapper">
                                    <FontAwesomeIcon icon={faCircleUser} />
                                </div>
                                <span>Users</span>
                            </button>
                            <button
                                className={`admin-sidebar-data ${activeSection === "feedback" ? "active" : ""}`}
                                onClick={() => setActiveSection("feedback")}
                            >
                                <div className="admin-icon-wrapper">
                                    <FontAwesomeIcon icon={faComment} />
                                </div>
                                <span>Feedback</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="admin-main">
                    <div className="admin-navbar">
                        <div className="admin-navbar-links">
                            <div className="admin-navbar-link">
                                <FontAwesomeIcon icon={faGear} />
                            </div>
                            <div className="admin-navbar-link">
                                <FontAwesomeIcon icon={faCircleUser} />
                            </div>
                            <button className="admin-navbar-link" onClick={handleLogout} title="Logout">
                                Logout
                            </button>
                        </div>
                    </div>
                    {/* Maybe switch content on clicking sidebar item, primarily it's on dashboard*/}
                    {/* <div className="admin-dashboard">
                        <div className="admin-dashboard-header">
                            <h2>DASHBOARD</h2>
                            <p>Welcome to your dashboard</p>
                        </div>
                        <div className="admin-cards">
                            {kpiData.map((item, index) => (
                                <KPICard key={index} {...item} />
                            ))}
                        </div>
                        <div className="admin-linechart">
                            <p>Revenue Generated</p>
                            <span>$5,000</span>
                            <LineChart data={LineChartData} />
                        </div>
                        <div className="admin-transaction"></div>
                    </div> */}

                    {activeSection === "dashboard" && (
                        <Dashboard />
                    )}
                    {activeSection === "rental" && (
                        <Rental />
                    )}
                    {activeSection === "stock" && (
                        <Stock />
                    )}
                    {activeSection === "booking" && (
                        <Booking />
                    )}
                    {activeSection === "users" && (
                        <Users />
                    )}
                    {activeSection === "payment" && (
                        <Payment />
                    )}
                    {activeSection === "feedback" && (
                        <Feedback />
                    )}
                </div>
            </div>
        </section>
    );
}

export default Admin;