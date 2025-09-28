import React, { useState } from "react";
import "./Home.css";
import { cars } from "../../data/mockData.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCaretDown, faCaretUp, faStar, faMagnifyingGlass, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const [toggle, setToggle] = useState("New"); 
    const [search, setSearch] = useState("");

    const options = [
        { label: "New", icon: faCheck },
        { label: "Price ascending", icon: faCaretDown },
        { label: "Price descending", icon: faCaretUp },
        { label: "Rating", icon: faStar }
    ];

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="home">
            <div className="home-container">
                <div className="home-sidebar">
                    <h3>Keywords</h3>
                    <div className="home-sidebar-keyword">
                        <p>Smart</p>
                        <p>Modern</p>
                    </div>
                    <hr />
                    <div className="home-sidebar-options">
                        <div className="home-sidebar-item">
                            <input type="checkbox" id="option1" name="option1" value={"A"} />
                            <div className="home-sidebar-info">
                                <label id="home-sidebar-label" htmlFor="option1">Label</label>
                                <p id="home-sidebar-description">Description</p>
                            </div>
                        </div>
                        {/* extra item */}
                        <div className="home-sidebar-item">
                            <input type="checkbox" id="option2" name="option2" value={"A"} />
                            <div className="home-sidebar-info">
                                <label id="home-sidebar-label" htmlFor="option2">Label</label>
                                <p id="home-sidebar-description">Description</p>
                            </div>
                        </div>
                        {/* extra item*/}
                    </div>
                    <hr />
                    <div className="home-sidebar-price">
                        <div className="home-sidebar-price-header">
                            <p>Label</p>
                            <p>$0-1000</p>
                        </div>
                        <div className="home-sidebar-price-range">
                            <input type="range" id="price-range" name="price-range" />
                            <div className="home-sidebar-price-values">
                                <p>$0</p>
                                <p>$1000</p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="home-sidebar-size">
                        <h3>Size</h3>
                        <div className="home-sidebar-label">
                            <input type="checkbox" id="label1" />
                            <p>Label</p>
                        </div>
                        {/* Copies starts here */}
                        <div className="home-sidebar-label">
                            <input type="checkbox" id="label2" />
                            <p>Label</p>
                        </div>
                        <div className="home-sidebar-label">
                            <input type="checkbox" id="label3" />
                            <p>Label</p>
                        </div>
                        {/* Copies ends here */}
                    </div>
                </div>

                {/* Right side */}
                <div className="home-main">
                    <div className="home-navbar">
                        <div className="home-navbar-search">
                            <input 
                                type="text" 
                                id="home-search" 
                                placeholder="Search" 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
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
                    </div>
                    <div className="home-list">
                        {filteredCars.map((car) => (
                            <div key={car.id} className="home-card">
                                <div className="home-card-image">
                                    <img src={car.image} alt={car.imageName} draggable={false} />
                                </div>
                                <div className="home-card-content">
                                    <h2>{car.name}</h2>
                                    <p>${car.price}/day</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;
