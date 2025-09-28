import React from "react";
import "./Admin.css";
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTruckFast, faGear, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import KPICard from "../../components/KPICard/KPICard.jsx";
import LineChart from "../../components/LineChart/LineChart.jsx";
import { kpiData, LineChartData } from "../../data/mockData.js";

const Admin = () => {
    return (
        <section className="admin">
            <div className="admin-container">
                <div className="admin-sidebar">
                    <h1>Admin Page</h1>
                    <Link to="/admin/rental" className="admin-sidebar-item">
                        <div className="admin-icon-wrapper">
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                        <p>Active rentals</p>
                    </Link>
                    <Link to="/admin/stock" className="admin-sidebar-item">
                        <div className="admin-icon-wrapper">
                            <FontAwesomeIcon icon={faTruckFast} />
                        </div>
                        <p>Current Stock</p>
                    </Link>
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
                        </div>
                    </div>
                    <div className="admin-dashboard">
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
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Admin;