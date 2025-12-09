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
    const [toggle, setToggle] = useState("new");
    const [searchText, setSearchText] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searched, setSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [bookingCar, setBookingCar] = useState(null);
    const [carFeedbacks, setCarFeedbacks] = useState({});
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [selectedCarFeedbacks, setSelectedCarFeedbacks] = useState(null);
    const [selectedRatingFilter, setSelectedRatingFilter] = useState(null); // Add this state

    const today = new Date().toISOString().split("T")[0];
    
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
                const lang = localStorage.getItem("lang") || "en";
                const res = await fetch(
                    `http://localhost:3000/api/v1/cars/available?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&lang=${encodeURIComponent(lang)}`
                );
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

    useEffect(() => {
        const fetchCarFeedbacks = async () => {
            if (searchResults.length === 0) return;
            
            try {
                const feedbacksMap = {};
                for (const car of searchResults) {
                    const res = await fetch(`http://localhost:3000/api/v1/feedbacks/car/${car.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        feedbacksMap[car.id] = data;
                    }
                }
                setCarFeedbacks(feedbacksMap);
            } catch (err) {
                console.error("Error fetching feedbacks:", err);
            }
        };
        
        fetchCarFeedbacks();
    }, [searchResults]);

    // Helper function to calculate average rating
    const getAverageRating = (carId) => {
        const feedbacks = carFeedbacks[carId];
        if (!feedbacks || feedbacks.length === 0) return 0;
        const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
        return (sum / feedbacks.length).toFixed(1);
    };

    const openFeedbackModal = (car) => {
        setSelectedCarFeedbacks({ car, feedbacks: carFeedbacks[car.id] || [] });
        setSelectedRatingFilter(null); // Reset filter when opening
        setFeedbackModalOpen(true);
    };

    const closeFeedbackModal = () => {
        setFeedbackModalOpen(false);
        setSelectedCarFeedbacks(null);
        setSelectedRatingFilter(null);
    };

    const getModalAverageRating = () => {
        if (!selectedCarFeedbacks?.feedbacks || selectedCarFeedbacks.feedbacks.length === 0) return 0;
        const sum = selectedCarFeedbacks.feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
        return (sum / selectedCarFeedbacks.feedbacks.length).toFixed(1);
    };

    // Filter feedbacks by selected rating
    const filteredFeedbacks = selectedCarFeedbacks?.feedbacks
        ? selectedRatingFilter 
            ? selectedCarFeedbacks.feedbacks.filter(fb => fb.rating === selectedRatingFilter)
            : selectedCarFeedbacks.feedbacks
        : [];

    // Sort feedbacks by rating descending (5 to 1)
    const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => b.rating - a.rating);

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
                            min={today}
                            value={startDate}
                            onChange={(e) => {
                                const newStart = e.target.value;
                                const safeStart = newStart < today ? today : newStart;
                                setStartDate(safeStart);
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
                            min={startDate || today}
                            onChange={(e) => {
                                const newEnd = e.target.value;
                                // ensure end date is not before startDate (and not in the past)
                                const minEnd = startDate || today;
                                if (newEnd < minEnd) {
                                    alert("End date cannot be before start date or today.");
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
                                        <p>€{car.price_per_day}/{t("home.day")}</p>
                                        <p>{t("home.added")}: {new Date(car.created_at).toLocaleDateString()}</p>
                                        
                                        {/* Reviews Section */}
                                        <div 
                                            className="home-card-reviews" 
                                            onClick={() => openFeedbackModal(car)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <FontAwesomeIcon icon={faStar} />
                                            <span>
                                                {getAverageRating(car.id)} ({carFeedbacks[car.id]?.length || 0} {t("home.reviews")})
                                            </span>
                                        </div>

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

                {/* Feedbacks Modal */}
                {feedbackModalOpen && selectedCarFeedbacks && (
                    <div className="home-feedback-modal-overlay" onClick={closeFeedbackModal}>
                        <div className="home-feedback-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="home-feedback-modal-close" onClick={closeFeedbackModal}>&times;</button>
                            <h3 className="home-feedback-modal-title">
                                {t("home.feedbackModal.title")} - {selectedCarFeedbacks.car.brand} {selectedCarFeedbacks.car.model}
                            </h3>

                            {/* Average Rating */}
                            <div className="home-feedback-average">
                                <div className="home-feedback-average-value">
                                    <span className="home-feedback-average-number">{getModalAverageRating()}</span>
                                    <FontAwesomeIcon icon={faStar} style={{ color: '#ffc107' }} />
                                </div>
                                <span className="home-feedback-average-count">
                                    {selectedCarFeedbacks.feedbacks.length} {t("home.reviews")}
                                </span>
                            </div>

                            {/* Star Filter */}
                            <div className="home-feedback-filter">
                                <label>{t("home.feedbackModal.filterByRating")}:</label>
                                <div className="home-feedback-filter-stars">
                                    <button
                                        className={`home-feedback-filter-btn ${selectedRatingFilter === null ? 'active' : ''}`}
                                        onClick={() => setSelectedRatingFilter(null)}
                                    >
                                        {t("home.feedbackModal.all")}
                                    </button>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={`home-feedback-filter-btn ${selectedRatingFilter === star ? 'active' : ''}`}
                                            onClick={() => setSelectedRatingFilter(star)}
                                        >
                                            {star}
                                            <FontAwesomeIcon icon={faStar} style={{ marginLeft: 4 }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feedbacks List */}
                            {sortedFeedbacks.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#8b949e', marginTop: 16 }}>
                                    {selectedRatingFilter 
                                        ? t("home.feedbackModal.noFeedbacksForRating")
                                        : t("home.feedbackModal.noFeedbacks")}
                                </p>
                            ) : (
                                <div className="home-feedback-list">
                                    {sortedFeedbacks.map((feedback) => (
                                        <div key={feedback.id} className="home-feedback-item">
                                            <div className="home-feedback-header">
                                                <div className="home-feedback-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon
                                                            key={i}
                                                            icon={faStar}
                                                            style={{
                                                                color: i < feedback.rating ? '#ffc107' : '#444c56',
                                                                fontSize: 14
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="home-feedback-date">
                                                    {new Date(feedback.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="home-feedback-comment">{feedback.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Home;

