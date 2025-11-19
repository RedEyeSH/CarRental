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
import BookingModal from "../../components/Modal/BookingModal.jsx";

import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();

    const [cars, setCars] = useState([]);
    const [toggle, setToggle] = useState("New");
    const [searchText, setSearchText] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searched, setSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [bookingCar, setBookingCar] = useState(null);

    const navigate = useNavigate();

    const options = [
        { label: t("home.sort.new"), icon: faCheck, value: "new" },
        { label: t("home.sort.priceAsc"), icon: faCaretDown, value: "priceAsc" },
        { label: t("home.sort.priceDesc"), icon: faCaretUp, value: "priceDesc" },
        { label: t("home.sort.rating"), icon: faStar, value: "rating" },
    ];

    useEffect(() => {
        const fetchCars = async () => {
            if (!startDate || !endDate) return;
            try {
                const res = await fetch(`http://localhost:3000/api/v1/cars/available?start_date=${startDate}&end_date=${endDate}`);
                if (!res.ok) throw new Error("Failed to fetch cars");
                const data = await res.json();
                setCars(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCars();
    }, [startDate, endDate]);

    // Restore search from localStorage
    useEffect(() => {
        const storedSearch = JSON.parse(localStorage.getItem("homeSearch"));
        if (storedSearch) {
            const today = new Date().toISOString().split("T")[0];
            if (storedSearch.startDate >= today) {
                setSearchText(storedSearch.searchText);
                setStartDate(storedSearch.startDate);
                setEndDate(storedSearch.endDate);
                setSearched(true);
            } else {
                localStorage.removeItem("homeSearch");
            }
        }
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

        localStorage.setItem(
            "homeSearch",
            JSON.stringify({ searchText, startDate, endDate })
        );
    };

    const sortedCars = [...searchResults].sort((a, b) => {
        if (toggle === "priceAsc") return a.price_per_day - b.price_per_day;
        if (toggle === "priceDesc") return b.price_per_day - a.price_per_day;
        if (toggle === "new") return new Date(b.created_at) - new Date(a.created_at);
        return 0;
    });

    return (
        <section className="home">
            <div className="home-main-centered">
                <h1 className="home-heading">{t("home.heading")}</h1>
                <form className="home-search-box" onSubmit={handleSearch}>
                    <div className="search-text-input">
                        <label>{t("home.searchCar")}</label>
                        <input
                            type="text"
                            placeholder={t("home.searchPlaceholder")}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="date-input">
                        <label>{t("home.startDate")}</label>
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
                        <label>{t("home.endDate")}</label>
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
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> {t("home.search")}
                    </button>
                </form>

                {searched && (
                    <div className="home-navbar-options">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`home-navbar-option ${toggle === option.value ? "active" : ""}`}
                                onClick={() => setToggle(option.value)}
                            >
                                <p>{option.label}</p>
                                <FontAwesomeIcon icon={option.icon} />
                            </div>
                        ))}
                    </div>
                )}

                {searched && (
                    <div className={`home-list ${sortedCars.length === 0 ? "no-cars" : ""}`}>
                        {sortedCars.length > 0 ? (
                            sortedCars.map((car) => (
                                <div key={car.id} className="home-card">
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
                                        <p>{t("home.added")}: {new Date(car.created_at).toLocaleDateString()}</p>
                                        <button className="book-btn" onClick={() => setBookingCar(car)}>
                                            {t("home.bookNow")}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-cars-message">{t("home.noCars")}</p>
                        )}
                    </div>
                )}

                {bookingCar && (
                    <BookingModal
                        car={bookingCar}
                        startDate={startDate}
                        endDate={endDate}
                        onClose={() => setBookingCar(null)}
                    />
                )}

            </div>
        </section>
    );
};

export default Home;

