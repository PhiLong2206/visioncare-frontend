import { Routes, Route } from "react-router-dom";
import OrdersManagement from "./pages/StaffPages/OrdersManagement/index";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OrdersManagement />} />
      <Route path="staff/orders" element={<OrdersManagement />} />
    </Routes>
  );
}