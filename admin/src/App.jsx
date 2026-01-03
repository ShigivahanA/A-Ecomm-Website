// src/App.jsx
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";              // product add (keep as-is)
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import AddJob from "./pages/AddJob";
import ListJobs from "./pages/ListJobs";
import AdminNewsletter from "./pages/AdminNewsletter";
import Banner from "./pages/Banner";
import OrderCancellations from "./pages/OrderCancellations";
import OrderReturns from "./pages/OrderReturns";
import AdminCoupons from "./pages/AdminCoupons";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
export const currency = "₹";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    // keep localStorage synced with state
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                {/* Product admin pages (keep these as they are) */}
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/add-job" element={<AddJob token={token} />} />
                <Route path="/jobs-list" element={<ListJobs token={token} />} />
                <Route path="/banner" element={<Banner token={token} />} />
                <Route path="/newsletter" element={<AdminNewsletter token={token} />} />
                <Route path="/order-cancellations" element={<OrderCancellations token={token} />} />
                <Route path="/return" element={<OrderReturns token={token} />} />
                <Route path="/coupons" element={<AdminCoupons token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
