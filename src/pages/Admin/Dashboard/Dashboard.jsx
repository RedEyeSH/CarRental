import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import KPICard from "../../../components/KPICard/KPICard.jsx";
import LineChart from "../../../components/LineChart/LineChart.jsx";
import { kpiData } from "../../../data/mockData.js";

const Dashboard = () => {
    // Bookings State
    const [bookingCount, setBookingCount] = useState(null);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [errorBookings, setErrorBookings] = useState(null);
    // Cars State
    const [carCount, setCarCount] = useState(null);
    const [loadingCars, setLoadingCars] = useState(true);
    const [errorCars, setErrorCars] = useState(null);
    // Revenue State
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [loadingRevenue, setLoadingRevenue] = useState(true);
    // Revenue Chart Data State
    const [revenueChartData, setRevenueChartData] = useState([]);
    // Car Rental Count Chart Data State
    const [carRentalChartData, setCarRentalChartData] = useState([]);

    useEffect(() => {
        // Fetch bookings
        const fetchBookings = async () => {
            setLoadingBookings(true);
            setLoadingRevenue(true);
            setErrorBookings(null);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/v1/bookings/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch bookings');
                const data = await response.json();
                const bookingsArr = Array.isArray(data) ? data : (data.bookings || []);
                setBookingCount(bookingsArr.length);
                // Calculate total revenue
                const revenue = bookingsArr.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
                setTotalRevenue(revenue);
                // Prepare revenue chart data: group by date, sum total_price per day
                const revenueByDate = {};
                bookingsArr.forEach(b => {
                    const date = b.created_at ? b.created_at.slice(0, 10) : null;
                    if (date) {
                        revenueByDate[date] = (revenueByDate[date] || 0) + (Number(b.total_price) || 0);
                    }
                });
                setRevenueChartData([
                    {
                        id: 'Revenue',
                        data: Object.entries(revenueByDate).map(([date, total]) => ({ x: date, y: total }))
                    }
                ]);
            } catch (err) {
                setErrorBookings('Could not load bookings');
                setBookingCount(null);
                setTotalRevenue(null);
                setRevenueChartData([]);
            } finally {
                setLoadingBookings(false);
                setLoadingRevenue(false);
            }
        };

        // Fetch cars
        const fetchCars = async () => {
            setLoadingCars(true);
            setErrorCars(null);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/v1/cars', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch cars');
                const data = await response.json();
                const carsArr = Array.isArray(data) ? data : (data.cars || []);
                setCarCount(carsArr.length);
                // Prepare car rental count chart data (top 10 cars by rental count)
                const top10Cars = carsArr
                    .slice() // copy array to avoid mutating original
                    .sort((a, b) => (b.rental_count || 0) - (a.rental_count || 0))
                    .slice(0, 10);
                setCarRentalChartData([
                    {
                        id: 'Rental Count',
                        data: top10Cars.map(car => ({
                            x: `${car.brand} ${car.model}`,
                            y: car.rental_count || 0
                        }))
                    }
                ]);
            } catch (err) {
                setErrorCars('Could not load cars');
                setCarCount(null);
                setCarRentalChartData([]);
            } finally {
                setLoadingCars(false);
            }
        };

        fetchBookings();
        fetchCars();
    }, []);

    // Format revenue as currency
    const formatCurrency = (value) => {
        if (typeof value !== 'number') return '€0';
        return value.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h2>DASHBOARD</h2>
                <p>Welcome to your dashboard</p>
            </div>

            <div className="admin-cards">
                {/* Real Bookings KPI Card */}
                <KPICard
                    icon={kpiData[0].icon}
                    label={kpiData[0].label}
                    value={loadingBookings ? 0 : (bookingCount ?? 0)}
                    change={kpiData[0].change}
                    color={kpiData[0].color}
                />
                {/* Real Available Units KPI Card */}
                <KPICard
                    icon={kpiData[1].icon}
                    label={kpiData[1].label}
                    value={loadingCars ? 0 : (carCount ?? 0)}
                    change={kpiData[1].change}
                    color={kpiData[1].color}
                />
                {/* Real Total Revenue KPI Card */}
                <KPICard
                    icon={kpiData[2].icon}
                    label={kpiData[2].label}
                    value={loadingRevenue ? '$0' : formatCurrency(totalRevenue)}
                    change={kpiData[2].change}
                    color={kpiData[2].color}
                />
                {/* Other KPI Cards */}
                {kpiData.slice(3).map((item, index) => (
                    <KPICard key={index + 3} {...item} />
                ))}
            </div>

            <div className="admin-chart">
                <h3>Revenue Generated</h3>
                <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: 8 }}>
                    Total: {formatCurrency(totalRevenue)}
                </div>
                <LineChart data={revenueChartData} />
            </div>

            {/* Car Rental Count Chart */}
            <div className="admin-chart">
                <h3>Car Rental Count</h3>
                <LineChart data={carRentalChartData} />
            </div>

            {/* Show any errors */}
            {errorBookings && <div className="dashboard-error">{errorBookings}</div>}
            {errorCars && <div className="dashboard-error">{errorCars}</div>}
        </div>

    );
};

export default Dashboard;
