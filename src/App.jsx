import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Products from "./pages/Products";
import Footer from "./components/Footer";

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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f6f7f9]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
<Route path="/orders/:orderId" element={<OrderDetail />} />
<Route path="/products" element={<Products />} />
<Route path="/dashboard" element={<Orders />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;