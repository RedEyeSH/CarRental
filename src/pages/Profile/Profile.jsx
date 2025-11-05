import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faCar,
    faGear,
    faRightFromBracket,
    faClockRotateLeft,
    faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthContext.jsx";

import { useTranslation } from "react-i18next";

const Profile = () => {
    const { t, i18n } = useTranslation();

    const [activeSection, setActiveSection] = useState("overview");
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState(null);
    const [carDetails, setCarDetails] = useState({});
    const [carDetailsLoading, setCarDetailsLoading] = useState(false);
    const [carDetailsError, setCarDetailsError] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedBookingLoading, setSelectedBookingLoading] = useState(false);
    const [selectedBookingError, setSelectedBookingError] = useState(null);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [feedbackBooking, setFeedbackBooking] = useState(null);
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackComment, setFeedbackComment] = useState("");
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackError, setFeedbackError] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbacksLoading, setFeedbacksLoading] = useState(false);
    const [feedbacksError, setFeedbacksError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [settingsName, setSettingsName] = useState("");
    const [settingsEmail, setSettingsEmail] = useState("");
    const [settingsPhone, setSettingsPhone] = useState("");
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [settingsError, setSettingsError] = useState(null);
    const [settingsSuccess, setSettingsSuccess] = useState(null);
    const { user, loading, error, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setSettingsName(user.name);
            setSettingsEmail(user.email);
            setSettingsPhone(user.phone || "");
        }
    }, [user]);

    useEffect(() => {
        if (activeSection !== "history") return;
        const token = localStorage.getItem("token");
        if (!token) return;
        setBookingsLoading(true);
        setBookingsError(null);
        fetch("http://localhost:3000/api/v1/bookings/customer", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    setBookings([]);
                    setBookingsLoading(false);
                    setBookingsError("Unauthorized");
                    return null;
                }
                if (!res.ok) throw new Error("Failed to fetch bookings");
                return res.json();
            })
            .then((data) => {
                if (data) setBookings(data);
            })
            .catch(() => setBookingsError("Failed to load bookings"))
            .finally(() => setBookingsLoading(false));
    }, [activeSection]);

    useEffect(() => {
        if (activeSection !== "history" || bookings.length === 0) return;
        const uniqueCarIds = [...new Set(bookings.map(b => b.car_id))];
        const missingCarIds = uniqueCarIds.filter(id => !carDetails[id]);
        if (missingCarIds.length === 0) return;
        setCarDetailsLoading(true);
        setCarDetailsError(null);
        Promise.all(
            missingCarIds.map(id =>
                fetch(`http://localhost:3000/api/v1/cars/${id}`)
                    .then(res => {
                        if (!res.ok) throw new Error();
                        return res.json();
                    })
                    .then(data => ({ id, data }))
                    .catch(() => ({ id, data: null }))
            )
        )
            .then(results => {
                setCarDetails(prev => {
                    const updated = { ...prev };
                    results.forEach(({ id, data }) => {
                        if (data) updated[id] = data;
                    });
                    return updated;
                });
            })
            .catch(() => setCarDetailsError("Failed to load car details"))
            .finally(() => setCarDetailsLoading(false));
    }, [activeSection, bookings]);

    useEffect(() => {
        if (!viewModalOpen || !selectedBookingId) return;
        const token = localStorage.getItem("token");
        if (!token) return;
        setSelectedBookingLoading(true);
        setSelectedBookingError(null);
        fetch(`http://localhost:3000/api/v1/bookings/customer/${selectedBookingId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => setSelectedBooking(data))
            .catch(() => setSelectedBookingError("Failed to load booking details"))
            .finally(() => setSelectedBookingLoading(false));
    }, [viewModalOpen, selectedBookingId]);

    // Fetch feedbacks for the user after bookings are loaded
    useEffect(() => {
        if (!user || bookings.length === 0) return;
        setFeedbacksLoading(true);
        setFeedbacksError(null);
        const token = localStorage.getItem("token");
        fetch("http://localhost:3000/api/v1/feedbacks", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => setFeedbacks(data))
            .catch(() => setFeedbacksError("Failed to load feedbacks"))
            .finally(() => setFeedbacksLoading(false));
    }, [user, bookings]);

    // Replace handleLogout
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const openViewModal = (id) => {
        setSelectedBookingId(id);
        setSelectedBooking(null); // Reset previous booking
        setSelectedBookingError(null); // Reset previous error
        setViewModalOpen(true);
    };

    const closeViewModal = () => {
        setViewModalOpen(false);
        setSelectedBookingId(null);
        setSelectedBooking(null);
        setSelectedBookingError(null);
    };

    // Feedback modal handlers
    const openFeedbackModal = (booking) => {
        setFeedbackBooking(booking);
        setFeedbackRating(5);
        setFeedbackComment("");
        setFeedbackError(null);
        setFeedbackModalOpen(true);
    };
    const closeFeedbackModal = () => {
        setFeedbackModalOpen(false);
        setFeedbackBooking(null);
        setFeedbackError(null);
    };
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!user || !feedbackBooking) return;
        setFeedbackLoading(true);
        setFeedbackError(null);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:3000/api/v1/feedbacks", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    car_id: feedbackBooking.car_id,
                    rating: feedbackRating,
                    comment: feedbackComment,
                }),
            });
            console.log("Submitting feedback for car ID:", feedbackBooking.car_id);
            if (!res.ok) throw new Error("Failed to submit feedback");
            toast.success("Feedback submitted successfully!");
            setTimeout(() => {
                closeFeedbackModal();
            }, 1200);
        } catch (err) {
            setFeedbackError("Failed to submit feedback");
        } finally {
            setFeedbackLoading(false);
        }
    };

    // Normalize role for className
    const normalizedRole = user?.role?.toLowerCase() || "customer";
    const roleClassName = `${normalizedRole}-role`;

    // In render, before feedback modal:
    const now = new Date();
    // Helper to check if feedback exists for a booking
    const hasFeedbackForBooking = (booking) => {
        return feedbacks.some(fb => fb.car_id === booking.car_id && fb.user_id === user?.id);
    };
    const getFeedbackForBooking = (booking) => {
        return feedbacks.find(fb => fb.car_id === booking.car_id && fb.user_id === user?.id);
    };

    let canSubmitFeedback = true;
    let feedbackStartDate = null;
    if (feedbackBooking && feedbackBooking.start_date) {
        feedbackStartDate = new Date(feedbackBooking.start_date);
        canSubmitFeedback = now >= feedbackStartDate;
    }

    // Filtered bookings for search
    const filteredBookings = bookings.filter((booking) => {
        if (!searchTerm) return true;
        const car = carDetails[booking.car_id];
        const carString = car ? `${car.brand} ${car.model} ${car.license_plate}`.toLowerCase() : "";
        return (
            booking.id.toString().includes(searchTerm.toLowerCase()) ||
            carString.includes(searchTerm.toLowerCase()) ||
            booking.start_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.end_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.total_price.toString().includes(searchTerm.toLowerCase()) ||
            booking.payment_status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <section className="profile-page">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="profile-sidebar-header">
                        <p>{t("profile.myProfile")}</p>
                    </div>
                    {user && (
                        <div className="profile-sidebar-user">
                            <div className="profile-avatar">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="profile-user-info">
                                <h3>{user.name}</h3>
                                <span className={`profile-role ${roleClassName}`}>
                                    {t(`profile.roles.${user?.role?.toLowerCase() || "Customer"}`)}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="profile-sidebar-items">
                        <button
                            className={`profile-sidebar-item ${activeSection === "overview" ? "active" : ""}`}
                            onClick={() => setActiveSection("overview")}
                        >
                            <FontAwesomeIcon icon={faAddressCard} />
                            <span>{t("profile.overview")}</span>
                        </button>
                        <button
                            className={`profile-sidebar-item ${activeSection === "history" ? "active" : ""}`}
                            onClick={() => setActiveSection("history")}
                        >
                            <FontAwesomeIcon icon={faClockRotateLeft} />
                            <span>{t("profile.rentalHistory")}</span>
                        </button>
                        <button
                            className={`profile-sidebar-item ${activeSection === "settings" ? "active" : ""}`}
                            onClick={() => setActiveSection("settings")}
                        >
                            <FontAwesomeIcon icon={faGear} />
                            <span>{t("profile.settings")}</span>
                        </button>
                        <button
                            className="profile-sidebar-item logout"
                            onClick={handleLogout}
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            <span>{t("profile.logout")}</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="profile-main">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>{error}</p>
                    ) : (
                        <>
                        {activeSection === "overview" && (
                            <div className="profile-section">
                                <h2>{t("profile.overviewPage.accountOverview")}</h2>
                                {user ? (
                                    <div className="profile-overview">
                                        <div className="profile-summary-card">
                                            <div className="profile-summary-left">
                                                <div className="profile-avatar large">
                                                    <FontAwesomeIcon icon={faUser} />
                                                </div>
                                                <div>
                                                    <h3>{user.name}</h3>
                                                    <span className={`profile-role ${roleClassName}`}>
                                                        {t(`profile.roles.${user?.role?.toLowerCase() || "customer"}`)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-info-grid">
                                            <div className="info-card">
                                                <FontAwesomeIcon icon={faAddressCard} className="info-icon" />
                                                <div>
                                                    <p className="info-label">{t("profile.overviewPage.fullName")}</p>
                                                    <p className="info-value">{user.name}</p>
                                                </div>
                                            </div>
                                            <div className="info-card">
                                                <FontAwesomeIcon icon={faUser} className="info-icon" />
                                                <div>
                                                    <p className="info-label">{t("profile.overviewPage.email")}</p>
                                                    <p className="info-value">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="info-card">
                                                <FontAwesomeIcon icon={faGear} className="info-icon" />
                                                <div>
                                                    <p className="info-label">{t("profile.overviewPage.phone")}</p>
                                                    <p className="info-value">
                                                        {user.phone || t("profile.overviewPage.notProvided")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="info-card">
                                                <FontAwesomeIcon icon={faClockRotateLeft} className="info-icon" />
                                                <div>
                                                    <p className="info-label">{t("profile.overviewPage.createdAt")}</p>
                                                    <p className="info-value">
                                                        {user.created_at
                                                            ? new Date(user.created_at).toLocaleDateString(i18n.language)
                                                            : t("profile.overviewPage.notProvided")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p>{t("profile.loading")}</p>
                                )}
                            </div>
                        )}


                        {activeSection === "history" && (
                            <div className="profile-section">
                                <h2>{t("profile.rentalHistoryPage.title")}</h2>
                                <div style={{marginBottom:16}}>
                                    <input
                                        type="text"
                                        placeholder={t("profile.rentalHistoryPage.searchPlaceholder")}
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{padding:8, borderRadius:4, border:'1px solid #444c56', width:260, background:'#0d1117', color:'#fff'}}
                                    />
                                </div>
                                <div className="profile-history">
                                    {bookingsLoading || carDetailsLoading ? (
                                        <p>{t("profile.rentalHistoryPage.noRecords")}</p>
                                    ) : bookingsError || carDetailsError ? (
                                        <p style={{ color: 'red' }}>{bookingsError || carDetailsError}</p>
                                    ) : filteredBookings.length === 0 ? (
                                        <p>{t("profile.rentalHistoryPage.noRecords")}</p>
                                    ) : (
                                        <table className="rental-history-table">
                                            <thead>
                                                <tr>
                                                    <th>{t("profile.rentalHistoryPage.table.bookingId")}</th>
                                                    <th>{t("profile.rentalHistoryPage.table.car")}</th>
                                                    <th>{t("profile.rentalHistoryPage.table.startDate")}</th>
                                                    <th>{t("profile.rentalHistoryPage.table.endDate")}</th>
                                                    <th>{t("profile.rentalHistoryPage.table.totalPrice")}</th>
                                                    <th>{t("profile.rentalHistoryPage.table.paymentStatus")}</th>
                                                    <th>{t("profile.rentalHistoryPage.table.createdAt")}</th>
                                                    <th>{t("profile.rentalHistoryPage.table.action")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredBookings.map((booking) => {
                                                    const car = carDetails[booking.car_id];
                                                    const feedbackGiven = hasFeedbackForBooking(booking);
                                                    return (
                                                        <tr key={booking.id}>
                                                            <td>{booking.id}</td>
                                                            <td>
                                                                {car
                                                                    ? `${car.brand} ${car.model} (${car.license_plate})`
                                                                    : <span style={{color:'#8b949e'}}>Loading...</span>
                                                                }
                                                            </td>
                                                            <td>{booking.start_date}</td>
                                                            <td>{booking.end_date}</td>
                                                            <td>{booking.total_price}</td>
                                                            <td>{booking.payment_status}</td>
                                                            <td>{new Date(booking.created_at).toLocaleString(i18n.language)}</td>
                                                            <td style={{display:'flex',gap:6}}>
                                                                <button 
                                                                    onClick={() => openViewModal(booking.id)} 
                                                                    style={{
                                                                        padding:'4px 10px',
                                                                        borderRadius:4,
                                                                        border:'none',
                                                                        background:'#58a6ff',
                                                                        color:'#fff',
                                                                        cursor:'pointer'
                                                                    }}
                                                                >
                                                                    {t("profile.rentalHistoryPage.view")}
                                                                </button>
                                                                <button 
                                                                    onClick={() => openFeedbackModal(booking)} 
                                                                    disabled={feedbackGiven} 
                                                                    style={{
                                                                        padding:'4px 10px',
                                                                        borderRadius:4,
                                                                        border:'none',
                                                                        background: feedbackGiven ? '#444c56' : '#2ea043',
                                                                        color:'#fff',
                                                                        cursor: feedbackGiven ? 'not-allowed' : 'pointer'}}
                                                                >
                                                                    {feedbackGiven ? t("profile.rentalHistoryPage.feedbackGiven") : t("profile.rentalHistoryPage.feedback")}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                {/* Feedback Modal */}
                                {feedbackModalOpen && feedbackBooking && (
                                    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
                                        <div style={{background:'#161b22',padding:32,borderRadius:10,minWidth:320,maxWidth:400,color:'#fff',position:'relative'}}>
                                            <button onClick={closeFeedbackModal} style={{position:'absolute',top:10,right:10,background:'none',border:'none',color:'#fff',fontSize:20,cursor:'pointer'}}>&times;</button>
                                            {/* Car image and info */}
                                            {carDetails[feedbackBooking.car_id] && carDetails[feedbackBooking.car_id].image && (
                                                <img
                                                    src={`http://localhost:3000/public/uploads/${carDetails[feedbackBooking.car_id].image}`}
                                                    alt="Car"
                                                    style={{
                                                        width: '100%',
                                                        maxHeight: 180,
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                        marginBottom: 12,
                                                    }}
                                                />
                                            )}
                                            <h3 style={{marginTop:0, marginBottom:8}}>
                                                {t("profile.rentalHistoryPage.feedbackModal.title")}
                                                {carDetails[feedbackBooking.car_id] && (
                                                    <span style={{display:'block',fontWeight:'normal',fontSize:15,marginTop:4}}>
                                                        {carDetails[feedbackBooking.car_id].brand} {carDetails[feedbackBooking.car_id].model} ({carDetails[feedbackBooking.car_id].license_plate})
                                                    </span>
                                                )}
                                            </h3>
                                            {getFeedbackForBooking(feedbackBooking) ? (
                                                <div style={{marginBottom:12}}>
                                                    <div style={{color:'lightgreen',marginBottom:8}}>
                                                        {t("profile.rentalHistoryPage.feedbackModal.alreadySubmitted")}
                                                    </div>
                                                    <div><b>{t("profile.rentalHistoryPage.feedbackModal.rating")}:</b> {getFeedbackForBooking(feedbackBooking).rating}</div>
                                                    <div><b>{t("profile.rentalHistoryPage.feedbackModal.comment")}:</b> {getFeedbackForBooking(feedbackBooking).comment}</div>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleFeedbackSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
                                                    <div>
                                                        <label>{t("profile.rentalHistoryPage.feedbackModal.rating")}: </label>
                                                        <select value={feedbackRating} onChange={e => setFeedbackRating(Number(e.target.value))} style={{marginLeft:8}} required>
                                                            {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label>{t("profile.rentalHistoryPage.feedbackModal.comment")}:</label>
                                                        <textarea value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} rows={3} style={{width:'100%',marginTop:4}} required />
                                                    </div>
                                                    {!canSubmitFeedback && (
                                                        <div style={{color:'orange'}}>
                                                            {t("profile.rentalHistoryPage.feedbackModal.notAllowedYet")}
                                                            {/* You can only submit feedback after your rental has started ({feedbackBooking.start_date}). */}
                                                        </div>
                                                    )}
                                                    {feedbackError && <div style={{color:'red'}}>{feedbackError}</div>}
                                                    <button type="submit" disabled={feedbackLoading || !canSubmitFeedback} style={{padding:'6px 0',borderRadius:4,border:'none',background:'#2ea043',color:'#fff',cursor: canSubmitFeedback && !feedbackLoading ? 'pointer' : 'not-allowed',marginTop:8}}>
                                                        {/* {feedbackLoading ? 'Submitting...' : 'Submit Feedback'} */}
                                                        {feedbackLoading ? t("profile.rentalHistoryPage.feedbackModal.submitting") : t("profile.rentalHistoryPage.feedbackModal.submit")}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {/* View Booking Modal */}
                                {viewModalOpen && (
                                    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
                                        <div style={{background:'#161b22',padding:32,borderRadius:10,minWidth:320,maxWidth:400,color:'#fff',position:'relative'}}>
                                            <button onClick={closeViewModal} style={{position:'absolute',top:10,right:10,background:'none',border:'none',color:'#fff',fontSize:20,cursor:'pointer'}}>&times;</button>
                                            <h3 style={{marginTop:0}}>{t("profile.rentalHistoryPage.viewModal.title")}</h3>
                                            {selectedBookingLoading ? (
                                                <p>{t("profile.loading")}</p>
                                            ) : selectedBookingError ? (
                                                <p style={{color:'red'}}>{selectedBookingError}</p>
                                            ) : selectedBooking ? (
                                                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                                                    {/* Car image section */}
                                                    {carDetails[selectedBooking.car_id] && carDetails[selectedBooking.car_id].image && (
                                                        <img
                                                            src={`http://localhost:3000/public/uploads/${carDetails[selectedBooking.car_id].image}`}
                                                            alt="Car"
                                                            style={{
                                                                width: '100%',
                                                                maxHeight: 180,
                                                                objectFit: 'cover',
                                                                borderRadius: 8,
                                                                marginBottom: 12,
                                                            }}
                                                        />
                                                    )}
                                                    <div><b>{t("profile.rentalHistoryPage.table.bookingId")}:</b> {selectedBooking.id}</div>
                                                    <div><b>{t("profile.rentalHistoryPage.table.car")}:</b> {carDetails[selectedBooking.car_id] ? `${carDetails[selectedBooking.car_id].brand} ${carDetails[selectedBooking.car_id].model} (${carDetails[selectedBooking.car_id].license_plate})` : selectedBooking.car_id}</div>
                                                    <div><b>{t("profile.rentalHistoryPage.table.startDate")}:</b> {selectedBooking.start_date}</div>
                                                    <div><b>{t("profile.rentalHistoryPage.table.endDate")}:</b> {selectedBooking.end_date}</div>
                                                    <div><b>{t("profile.rentalHistoryPage.table.totalPrice")}:</b> {selectedBooking.total_price}</div>
                                                    <div><b>{t("profile.rentalHistoryPage.table.paymentStatus")}:</b> {selectedBooking.payment_status}</div>
                                                    <div><b>{t("profile.rentalHistoryPage.table.createdAt")}:</b> {new Date(selectedBooking.created_at).toLocaleString(i18n.language)}</div>
                                                </div>
                                            ) : (
                                                <p>{t("profile.rentalHistoryPage.viewModal.noData")}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeSection === "settings" && (
                            <div className="profile-section">
                                <h2>{t("profile.settingsPage.title")}</h2>
                                <div className="profile-language-selector">
                                    <label style={{ marginRight: "10px" }}>
                                        {t("profile.settingsPage.selectLanguage")}
                                    </label>
                                    <select
                                        className="profile-language-dropdown"
                                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                                        defaultValue={i18n.language}
                                    >
                                        <option value="en">English</option>
                                        <option value="ja">Japanese</option>
                                        <option value="ru">Russian</option>
                                    </select>
                                </div>

                                <p>{t("profile.settingsPage.updateYourInfo")}</p>

                                {user ? (
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            setSettingsLoading(true);
                                            setSettingsError(null);
                                            setSettingsSuccess(null);
                                            const token = localStorage.getItem("token");
                                            try {
                                                const res = await fetch("http://localhost:3000/api/v1/auth/me", {
                                                    method: "PUT",
                                                    headers: {
                                                        "Authorization": `Bearer ${token}`,
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify({
                                                        name: settingsName,
                                                        email: settingsEmail,
                                                        phone: settingsPhone
                                                    })
                                                });
                                                if (!res.ok) throw new Error("Failed to update profile");
                                                const updatedUser = await res.json();
                                                setUser(updatedUser);
                                                toast.success(t("profile.settingsPage.saveSuccess") || "Profile updated successfully!");
                                                // toast.success("Profile updated successfully!");
                                            } catch (err) {
                                                setSettingsError(t("profile.settingsPage.saveError") || "Failed to update profile");
                                                // setSettingsError("Failed to update profile");
                                            } finally {
                                                setSettingsLoading(false);
                                            }
                                        }}
                                        style={{display:'flex',flexDirection:'column',gap:16,maxWidth:400}}
                                    >
                                        <div>
                                            <label>{t("profile.settingsPage.fullName")}</label>
                                            <input
                                                type="text"
                                                value={settingsName}
                                                onChange={e => setSettingsName(e.target.value)}
                                                required
                                                style={{width:'100%',padding:8,borderRadius:4,border:'1px solid #444c56',background:'#0d1117',color:'#fff'}}
                                            />
                                        </div>
                                        <div>
                                            <label>{t("profile.settingsPage.email")}</label>
                                            <input
                                                type="email"
                                                value={settingsEmail}
                                                onChange={e => setSettingsEmail(e.target.value)}
                                                required
                                                style={{width:'100%',padding:8,borderRadius:4,border:'1px solid #444c56',background:'#0d1117',color:'#fff'}}
                                            />
                                        </div>
                                        <div>
                                            <label>{t("profile.settingsPage.phone")}</label>
                                            <input
                                                type="text"
                                                value={settingsPhone}
                                                onChange={e => setSettingsPhone(e.target.value)}
                                                style={{width:'100%',padding:8,borderRadius:4,border:'1px solid #444c56',background:'#0d1117',color:'#fff'}}
                                            />
                                        </div>
                                        {settingsError && <div style={{color:'red'}}>{settingsError}</div>}
                                        <button type="submit" disabled={settingsLoading} style={{padding:'8px 0',borderRadius:4,border:'none',background:'#2ea043',color:'#fff',cursor: settingsLoading ? 'not-allowed' : 'pointer'}}>
                                            {/* {settingsLoading ? 'Saving...' : 'Save Changes'} */}
                                            {settingsLoading ? t("profile.settingsPage.saving") || "Saving..." : t("profile.settingsPage.saveChanges")}
                                        </button>
                                    </form>
                                ) : (
                                    t("profile.loading")
                                    // <p>Loading...</p>
                                )}
                            </div>
                        )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Profile;
