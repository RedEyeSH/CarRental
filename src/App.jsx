import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import Stock from "./pages/Admin/Stock/Stock.jsx";
import ActiveRentals from "./pages/Admin/ActiveRentals/ActiveRentals.jsx";

// For now admin goes here for testing the UI design
import Admin from "./pages/Admin/Admin.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><Home/></MainLayout>}/>
          {/* <Route path="/admin" element={<Admin />} />asdasddad */}
          <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
          <Route path="/admin/stock" element={<AdminLayout><Stock /></AdminLayout>} />
          <Route path="/admin/rental" element={<AdminLayout><ActiveRentals /></AdminLayout>} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
