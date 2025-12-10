import React from "react";
import "./KPICard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const KPICard = ({ icon, label, value, change, color }) => {
  return (
    <div className="kpi-card">
        <div className="kpi-card-icon" style={{ color }}>
            <FontAwesomeIcon icon={icon} />
        </div>
        <div className="kpi-card-content">
            <div className="kpi-card-label">{label}</div>
            <div className="kpi-card-value">{value.toLocaleString()}</div>
        </div>
        {/* <div className="kpi-card-change" style={{ color }}>
            <p>{change}</p>
        </div> */}
    </div>
  );
};

export default KPICard;
