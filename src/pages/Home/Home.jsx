import React, { useState, useEffect } from "react";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faCaretDown,
    faCaretUp,
    faStar,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [cars, setCars] = useState([]);
    const [toggle, setToggle] = useState("New");
    const [searchText, setSearchText] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searched, setSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    const options = [
        { label: "New", icon: faCheck },
        { label: "Price ascending", icon: faCaretDown },
        { label: "Price descending", icon: faCaretUp },
        { label: "Rating", icon: faStar },
    ];

    // Fetch cars from the API
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/v1/cars/");
                if (!res.ok) throw new Error("Failed to fetch cars");
                const data = await res.json();
                setCars(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCars();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            alert("End date cannot be before start date.");
            return;
        }

        const results = cars.filter((car) =>
            `${car.brand} ${car.model}`.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchResults(results);
        setSearched(true);
    };

    const sortedCars = [...searchResults].sort((a, b) => {
        if (toggle === "Price ascending") return parseFloat(a.price_per_day) - parseFloat(b.price_per_day);
        if (toggle === "Price descending") return parseFloat(b.price_per_day) - parseFloat(a.price_per_day);
        if (toggle === "New") return new Date(b.created_at) - new Date(a.created_at);
        return 0;
    });

    return (
        <section className="home">
            <div className="home-main-centered">
                <form className="home-search-box" onSubmit={handleSearch}>
                    <div className="search-text-input">
                        <label>Search Car</label>
                        <input
                            type="text"
                            placeholder="Enter car name..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="date-input">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                const newStart = e.target.value;
                                setStartDate(newStart);
                                if (endDate && new Date(endDate) < new Date(newStart)) {
                                    setEndDate(newStart);
                                }
                            }}
                            required
                        />
                    </div>
                    <div className="date-input">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                const newEnd = e.target.value;
                                if (startDate && new Date(newEnd) < new Date(startDate)) {
                                    alert("End date cannot be before start date.");
                                    return;
                                }
                                setEndDate(newEnd);
                            }}
                            required
                        />
                    </div>
                    <button type="submit" className="search-btn">
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
                    </button>
                </form>

                {searched && (
                    <div className="home-navbar-options">
                        {options.map((option) => (
                            <div
                                key={option.label}
                                className={`home-navbar-option ${toggle === option.label ? "active" : ""}`}
                                onClick={() => setToggle(option.label)}
                            >
                                <p>{option.label}</p>
                                <FontAwesomeIcon icon={option.icon} />
                            </div>
                        ))}
                    </div>
                )}

                {searched && (
                    <div className="home-list">
                        {sortedCars.length > 0 ? (
                            sortedCars.map((car) => (
                                <div
                                    key={car.id}
                                    className="home-card"
                                    onClick={() => navigate("/payment", { state: { car, startDate, endDate } })}
                                >
                                    <div className="home-card-image">
                                        <img
                                            src={`http://localhost:3000/public/uploads/${car.image}`}
                                            alt={`${car.brand} ${car.model}`}
                                            draggable={false}
                                        />
                                    </div>
                                    <div className="home-card-content">
                                        <h2>{car.brand} {car.model} ({car.year})</h2>
                                        <p>€{car.price_per_day}/day</p>
                                        <p>Added: {new Date(car.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-cars-message">No cars found for your search.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home;
