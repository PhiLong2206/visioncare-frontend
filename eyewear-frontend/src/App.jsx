import { Routes, Route } from "react-router-dom";
import StaffPage from "./pages/StaffPages/index";
import OrderDetail from "./pages/StaffPages/OrdersManagement/OrderDetail/index"

export default function App() {
  return (
    <Routes>
      <Route path="staff" element={<StaffPage />} />
      <Route path="staff/orders/:id" element={<OrderDetail />} />
    </Routes>
  );
}