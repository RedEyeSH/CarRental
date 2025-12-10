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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);
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
        toast.success("Login successful!");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setShowLogin(true);
        toast.success("Logout successful!");
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (showLogin) {
        return <LoginModal isOpen={true} onLogin={handleLogin} />;
    }

    return (
        <section className="admin">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <div className="admin-container">
                <div className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                    <div className="admin-sidebar-header">
                        <p>Admin Page</p>
                        <FontAwesomeIcon icon={faBars} onClick={toggleSidebar} className="menu-toggle" />
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
                <div className={`admin-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                    <div className="admin-navbar">
                        <div className="admin-navbar-left">
                            <button 
                                className={`admin-navbar-menu-btn ${sidebarOpen ? "hidden" : "visible"}`}
                                onClick={toggleSidebar}
                            >
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                        </div>
                        <div className="admin-navbar-links">
                            {/* <div className="admin-navbar-link">
                                <FontAwesomeIcon icon={faGear} />
                            </div>
                            <div className="admin-navbar-link">
                                <FontAwesomeIcon icon={faCircleUser} />
                            </div> */}
                            <button className="admin-navbar-link logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>

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