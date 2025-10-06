import React, { useState } from "react";
import "./Home.css";
import { cars } from "../../data/mockData.js";
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

    const handleSearch = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        const results = cars.filter((car) =>
            car.name.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchResults(results);
        setSearched(true);
    };

    const sortedCars = [...searchResults].sort((a, b) => {
        if (toggle === "Price ascending") return a.price - b.price;
        if (toggle === "Price descending") return b.price - a.price;
        if (toggle === "New") return new Date(b.creationDate) - new Date(a.creationDate);
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
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="date-input">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
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
                                className={`home-navbar-option ${
                                    toggle === option.label ? "active" : ""
                                }`}
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
                        {sortedCars.map((car) => (
                            <div
                                key={car.id}
                                className="home-card"
                                onClick={() => navigate(`/payment/${car.id}?start=${startDate}&end=${endDate}`)}
                            >
                                <div className="home-card-image">
                                    <img src={car.image} alt={car.imageName} draggable={false} />
                                </div>
                                <div className="home-card-content">
                                    <h2>{car.name}</h2>
                                    <p>€{car.price}/day</p>
                                    <p>Added: {new Date(car.creationDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home;
