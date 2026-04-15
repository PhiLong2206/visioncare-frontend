import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";

import ProductDetail from "./pages/CustomerPages/ProductDetail";
import Cart from "./pages/CustomerPages/Cart";
import Orders from "./pages/CustomerPages/Orders";
import OrderDetail from "./pages/CustomerPages/OrderDetails";
import Products from "./pages/CustomerPages/Products";
import Login from "./pages/CustomerPages/Login";
import Register from "./pages/CustomerPages/Register";
import Checkout from "./pages/CustomerPages/Checkout";

import StaffPage from "./pages/StaffPages/index";
import StaffOrderDetail from "./pages/StaffPages/OrdersManagement/OrderDetail/index";

import ManagerPage from "./pages/ManagerPages/index"

function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <Categories />
      <FeaturedProducts />
    </>
  );
}

function AppContent() {
  const location = useLocation();

  const isStaffRoute = location.pathname.startsWith("/staff") || location.pathname.startsWith("/manager");
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {!isStaffRoute && !isAuthRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/dashboard" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/staff" element={<StaffPage />} />
        <Route path="/staff/orders/:id" element={<StaffOrderDetail />} />

        <Route path="/manager" element={<ManagerPage />} />
      </Routes>

      {!isStaffRoute && !isAuthRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;