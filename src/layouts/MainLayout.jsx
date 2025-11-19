import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const MainLayout = ({ children }) => {
    const { pathname } = useLocation();

    const showFooter = pathname === "/" ;

    return (
        <>
            <Navbar />
            {children}
            {showFooter && <Footer />}
        </>        
    );
}

export default MainLayout;