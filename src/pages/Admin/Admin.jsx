import "./Admin.css";
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTruckFast, faCalendar } from '@fortawesome/free-solid-svg-icons';

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
                    <div className="admin-navbar"></div>
                    <div className="admin-list">
                        <div className="admin-">
                            <div className=""></div>
                        </div>
                        <div className=""></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Admin;