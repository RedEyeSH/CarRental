import { useState } from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [toggle, setToggle] = useState("New"); 
    const options = ["New", "Price ascending", "Price descending", "Rating"];
    return (
        <section className="home">
            <div className="home-container">
                <div className="home-sidebar">
                    <p>Keywords</p>
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
                                <label id="home-sidebar-label" htmlFor="option1">Label</label>
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
                            <input type="range" />
                            <div className="home-sidebar-price-values">
                                <p>$0</p>
                                <p>$1000</p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="home-sidebar-size">
                        <div className="home-sidebar-label">
                            <input type="checkbox" />
                            <p>Label</p>
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="home-main">
                    <div className="home-navbar">
                        <div className="home-navbar-search">
                            <input type="text" id="home-search" placeholder="Search" />
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <div className="home-navbar-options">
                            {options.map((option) => (
                                <p 
                                    key={option}
                                    className={toggle === option ? "active" : ""}
                                    onClick={() => setToggle(option)}
                                >
                                    {option}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="home-list">
                        <div className="home-list-card">
                            <div className="home-list-card-image">
                                <img src="https://plus.unsplash.com/premium_photo-1737623479045-a6a27357ffa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D" alt="product-1" />
                            </div>
                            <div className="home-list-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        {/* copies */}
                        <div className="home-list-card">
                            <div className="home-list-card-image">
                                <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyfGVufDB8fDB8fHww" alt="product-1" />
                            </div>
                            <div className="home-list-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        <div className="home-list-card">
                            <div className="home-list-card-image">
                                <img src="https://plus.unsplash.com/premium_photo-1737623479045-a6a27357ffa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D" alt="product-1" />
                            </div>
                            <div className="home-list-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        <div className="home-list-card">
                            <div className="home-list-card-image">
                                <img src="https://plus.unsplash.com/premium_photo-1737623479045-a6a27357ffa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D" alt="product-1" />
                            </div>
                            <div className="home-list-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        <div className="home-list-card">
                            <div className="home-list-card-image">
                                <img src="https://plus.unsplash.com/premium_photo-1737623479045-a6a27357ffa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D" alt="product-1" />
                            </div>
                            <div className="home-list-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;
