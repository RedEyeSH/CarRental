import { useState } from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCaretDown, faCaretUp, faStar, faMagnifyingGlass, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [toggle, setToggle] = useState("New"); 

    const options = [
        { label: "New", icon: faCheck },
        { label: "Price ascending", icon: faCaretDown },
        { label: "Price descending", icon: faCaretUp },
        { label: "Rating", icon: faStar }
    ];

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
                            <input type="checkbox" id="label1" name="label1" />
                            <p>Label</p>
                        </div>
                        {/* Copies starts here */}
                        <div className="home-sidebar-label">
                            <input type="checkbox" id="label1" name="label1" />
                            <p>Label</p>
                        </div>
                        <div className="home-sidebar-label">
                            <input type="checkbox" id="label1" name="label1" />
                            <p>Label</p>
                        </div>
                        {/* Copies ends here */}
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
                        <div className="home-card">
                            <div className="home-card-image">
                                <img src="https://plus.unsplash.com/premium_photo-1737623479045-a6a27357ffa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D" alt="product-1" draggable={false} />
                            </div>
                            <div className="home-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                                <div className="home-card-content-location">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    <p>Location</p>
                                </div>
                            </div>
                        </div>
                        {/* Copies starts here */}
                        <div className="home-card">
                            <div className="home-card-image">
                                <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyfGVufDB8fDB8fHww" alt="product-1" />
                            </div>
                            <div className="home-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        <div className="home-card">
                            <div className="home-card-image">
                                <img src="https://images.unsplash.com/photo-1623006772851-a8bf2c47d304?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D" alt="product-1" />
                            </div>
                            <div className="home-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        <div className="home-card">
                            <div className="home-card-image">
                                <img src="https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTd8fGNhcnxlbnwwfHwwfHx8MA%3D%3D" alt="product-1" />
                            </div>
                            <div className="home-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        <div className="home-card">
                            <div className="home-card-image">
                                <img src="https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGNhcnxlbnwwfDF8MHx8fDA%3D" alt="product-1" />
                            </div>
                            <div className="home-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        <div className="home-card">
                            <div className="home-card-image">
                                <img src="https://images.unsplash.com/photo-1612593968469-d44a2e6ab5d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fGNhcnxlbnwwfDF8MHx8fDA%3D" alt="product-1" />
                            </div>
                            <div className="home-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        <div className="home-card">
                            <div className="home-card-image">
                                <img src="https://images.unsplash.com/photo-1601827280216-d850636510e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fGNhcnxlbnwwfDF8MHx8fDA%3D" alt="product-1" />
                            </div>
                            <div className="home-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>

                            </div>
                        </div>
                        <div className="home-card">
                            <div className="home-card-image">
                                <img src="https://images.unsplash.com/photo-1581208509730-ea918b007133?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fGNhcnxlbnwwfDF8MHx8fDA%3D" alt="product-1" />
                            </div>
                            <div className="home-card-content">
                                <h2>Car name</h2>
                                <p>$100/day</p>
                            </div>
                        </div>
                        {/* Copies ends here */}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;
