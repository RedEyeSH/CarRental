import React, { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// import Stock from "./pages/Admin/Stock/Stock.jsx";
// import ActiveRentals from "./pages/Admin/ActiveRentals/ActiveRentals.jsx";

import Booking from "./pages/Admin/Booking/Booking.jsx";
import Payment from "./pages/Payment/Payment.jsx";

// For now admin goes here for testing the UI design
import Admin from "./pages/Admin/Admin.jsx";

import Profile from "./pages/Profile/Profile.jsx";

import { AuthProvider } from "./contexts/AuthContext.jsx";

import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><Home/></MainLayout>}/>
          {/* <Route path="/admin" element={<Admin />} /> testing */}
          <Route path="/booking/:carId" element={<MainLayout><Booking /></MainLayout>} />
          <Route path="/payment/" element={<MainLayout><Payment /></MainLayout>} />
          <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          {/* <Route path="/admin/stock" element={<AdminLayout><Stock /></AdminLayout>} /> */}
          {/* <Route path="/admin/rental" element={<AdminLayout><ActiveRentals /></AdminLayout>} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
