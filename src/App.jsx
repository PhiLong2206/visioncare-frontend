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

import StaffPage from "./pages/StaffPages/index";
import StaffOrderDetail from "./pages/StaffPages/OrdersManagement/OrderDetail/index";

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
  const isStaffRoute = location.pathname.startsWith("/staff");

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {!isStaffRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/dashboard" element={<Orders />} />

        <Route path="/staff" element={<StaffPage />} />
        <Route path="/staff/orders/:id" element={<StaffOrderDetail />} />
      </Routes>

      {!isStaffRoute && <Footer />}
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