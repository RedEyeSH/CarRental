import React from "react";
import "./Dashboard.css";
import KPICard from "../../../components/KPICard/KPICard.jsx";
import LineChart from "../../../components/LineChart/LineChart.jsx";
import { kpiData, LineChartData } from "../../../data/mockData.js";

const Dashboard = () => {
    return (
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
    );
}

export default Dashboard;
