import React, { useState, useEffect } from "react";
import "./ActiveRentals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const ActiveRentals = () => {
    const [toggle, setToggle] = useState("Filter");
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // Notification system placeholder
    const [notifications, setNotifications] = useState([]);

    const options = [
        { label: "Filter", icon: faFilter },
        { label: "Edit Listing", icon: "" }
    ];

    useEffect(() => {
        const fetchRentals = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all cars
                const carsRes = await fetch("http://localhost:3000/api/v1/cars/");
                if (!carsRes.ok) throw new Error("Failed to fetch cars");
                const cars = await carsRes.json();
                // Filter rented cars
                const rentedCars = cars.filter(car => car.status === "RENTED");
                if (rentedCars.length === 0) {
                    setRentals([]);
                    setLoading(false);
                    return;
                }
                const token = localStorage.getItem("token");
                // Fetch bookings and users in parallel
                const [bookingsRes, usersRes] = await Promise.all([
                    fetch("http://localhost:3000/api/v1/bookings/", {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch("http://localhost:3000/api/v1/auth/users/", {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
                if (!usersRes.ok) throw new Error("Failed to fetch users");
                const bookings = await bookingsRes.json();
                const users = await usersRes.json();
                setUsers(users);
                // Match bookings to rented cars and users
                const activeRentals = bookings
                    .filter(booking => rentedCars.some(car => car.id === booking.car_id))
                    .map(booking => {
                        const car = rentedCars.find(car => car.id === booking.car_id);
                        const user = users.find(user => user.id === booking.user_id);
                        return {
                            car,
                            booking,
                            user
                        };
                    });
                setRentals(activeRentals);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    // Filtering logic for search bar
    const filteredRentals = rentals.filter(({ car, booking, user }) => {
        const carName = car ? (car.title || car.model || car.license_plate || "") : "";
        const userName = user ? user.name : "";
        return (
            carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(booking.id).includes(searchTerm)
        );
    });

    return (
        <section className="active-rentals-section">
            <h2>Active Rentals</h2>
            <input
                type="text"
                className="active-rentals-search"
                placeholder="Search by car, user, or booking ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {loading ? (
                <div className="active-rentals-loading">Loading active rentals...</div>
            ) : error ? (
                <div className="active-rentals-error">{error}</div>
            ) : (
                <table className="active-rentals-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Car</th>
                            <th>User</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRentals.length === 0 ? (
                            <tr><td colSpan="5">No active rentals found.</td></tr>
                        ) : filteredRentals.map(({ car, booking, user }) => (
                            <tr key={booking.id}>
                                <td>{car && car.image ? <img src={`http://localhost:3000/public/uploads/${car.image}`} alt={car.model} style={{width: 60, height: 40, objectFit: 'cover'}} /> : '-'}</td>
                                <td>{car.brand} {car.model} ({car.license_plate})</td>
                                <td>{user.email}</td>
                                <td>{booking.start_date
                                    ? new Date(booking.start_date).toLocaleString('en-GB', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })
                                    : "-"}</td>
                                <td>{booking.end_date
                                    ? new Date(booking.end_date).toLocaleString('en-GB', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })
                                    : "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Notification container for future extensibility */}
            <div className="notification-container">
                {notifications.map((n, index) => (
                    <div
                        key={n.id}
                        className={`notification ${n.exiting ? "slide-out" : "slide-in"}`}
                        style={{ top: `${index * 60}px` }}
                    >
                        {n.message}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ActiveRentals;
