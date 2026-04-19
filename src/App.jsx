import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";

import AdminPage from "./pages/AdminPages";
import OperationPage from "./pages/OperationPages/OperationPage";
import ManagerPage from "./pages/ManagerPages/index";
import StaffPage from "./pages/StaffPages/index";
import StaffOrderDetail from "./pages/StaffPages/OrdersManagement/OrderDetail/index";

import ProductDetail from "./pages/CustomerPages/ProductDetail";
import Cart from "./pages/CustomerPages/Cart";
import Orders from "./pages/CustomerPages/Orders";
import OrderDetail from "./pages/CustomerPages/OrderDetails";
import Products from "./pages/CustomerPages/Products";
import Login from "./pages/CustomerPages/Login";
import Register from "./pages/CustomerPages/Register";
import Checkout from "./pages/CustomerPages/Checkout";

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

  const isStaffRoute =
    location.pathname.startsWith("/staff") ||
    location.pathname.startsWith("/manager");

  const isOperationRoute = location.pathname.startsWith("/operation");
  const isAdminRoute = location.pathname.startsWith("/admin");

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  const hideLayout =
    isStaffRoute || isOperationRoute || isAdminRoute || isAuthRoute;

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {!hideLayout && <Navbar />}

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

        <Route path="/operation" element={<OperationPage />} />

        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      {!hideLayout && <Footer />}
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