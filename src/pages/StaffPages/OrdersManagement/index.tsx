import { useState, ReactElement, useMemo, useEffect } from "react";
import { CircleCheck, CircleAlert, CircleMinus, ChevronLeft, ChevronRight, Bell } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { getAllOrders, Order, ORDER_TYPE_STYLES, ORDERS_PER_PAGE, PrescriptionStatus, STATUS_STYLES, TYPEITEMS, transStatus } from "../../../api/staffAPI/orderAPI";

const PRESCRIPTION_ICON: Record<PrescriptionStatus, ReactElement> = {
  Verified: (
    <span className="inline-flex items-center gap-1 text-teal-600 font-medium text-sm">
      <CircleCheck className="w-4 h-4" />
      Đã xác nhận
    </span>
  ),
  "Manual Check Required": (
    <span className="inline-flex items-center gap-1 text-orange-500 font-medium text-sm">
      <CircleAlert className="w-4 h-4" />
      Yêu cầu kiểm tra thủ công
    </span>
  ),
  "No Rx Attached": (
    <span className="inline-flex items-center gap-1 text-gray-400 font-medium text-sm">
      <CircleMinus className="w-4 h-4" />
      Không có chỉ số kèm theo.
    </span>
  ),
};

export default function OrdersManagement() {
  const [orderTypeFilter, setOrderTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [orders, setOrders] = useState<Order[] | []>([]);

  const navigate = useNavigate()

  const fetchOrders = async () => {
    const fetchOrders = await getAllOrders();
    setOrders(fetchOrders)
  }
  fetchOrders()

  useEffect(() => {
    fetchOrders()
  }, [orders, orderTypeFilter, statusFilter])

  // Filter — recomputed only when filters change
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const typeOk = orderTypeFilter === "All" || o.orderType === orderTypeFilter;
      const statusOk = statusFilter === "All" || o.status === statusFilter;
      return typeOk && statusOk;
    });
  }, [orders, orderTypeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ORDERS_PER_PAGE));

  // Reset page to 1 whenever a filter changes
  const handleFilterChange = (type: "orderType" | "status", value: string) => {
    setCurrentPage(1);
    if (type === "orderType") setOrderTypeFilter(value);
    else setStatusFilter(value);
  };

  const handleReset = () => {
    setOrderTypeFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  // Slice the filtered list for the current page
  const paginated = filtered.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ORDERS_PER_PAGE, filtered.length);

  // Smart page number list: first, last, current ± 1, ellipsis where needed
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <main className="flex-1 overflow-y-auto px-8 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-400 mt-1">Quản lý, xác minh và theo dõi tất cả các đơn thuốc và quy trình cấp phát thuốc chăm sóc thị lực.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 tracking-widest mb-1.5">LOẠI ĐƠN HÀNG</label>
            <select
              value={orderTypeFilter}
              onChange={(e) => handleFilterChange("orderType", e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none cursor-pointer min-w-32"
            >
              <option>All</option>
              <option>ORDER</option>
              <option>PRE-ORDER</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 tracking-widest mb-1.5">TRẠNG THÁI</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none cursor-pointer min-w-36"
            >
              <option value="All">All</option>

              {TYPEITEMS.map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 tracking-widest mb-1.5">NGÀY</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-40 cursor-pointer">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-400">Chọn ngày...</span>
            </div>
          </div>
          <div className="flex-1" />
          <button onClick={handleReset} className="text-sm text-teal-500 font-semibold hover:text-teal-700 mt-5 transition-colors">
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Mã Đơn", "Khách Hàng", "Ngày", "Loại", "Thông Số", "Trạng Thái", "Hành Động"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 tracking-widest px-5 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((order, i) => (
              <tr
                key={order.id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
              >
                {/* ID */}
                <td className="px-5 py-4">
                  <button className="text-teal-500 font-semibold text-sm hover:text-teal-700 hover:underline">
                    #{order.id}
                  </button>
                </td>

                {/* Customer */}
                <td className="px-5 py-4">
                  <p className="font-semibold text-gray-800 text-sm">{order.customer}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.email}</p>
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-sm text-gray-500">{order.date}</td>

                {/* Order Type */}
                <td className="px-5 py-4">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md tracking-wide ${ORDER_TYPE_STYLES[order.orderType]}`}>
                    {order.orderType}
                  </span>
                </td>

                {/* Prescription */}
                <td className="px-5 py-4">{PRESCRIPTION_ICON[order.prescription]}</td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md tracking-wide ${STATUS_STYLES[order.status]}`}>
                    {transStatus(order)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-gray-400 hover:text-teal-500 transition-colors"
                      title="View"
                      onClick={() => navigate(`/staff/orders/${order.id}`)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {filtered.length === 0
              ? "No orders found"
              : `Showing ${startItem}–${endItem} of ${filtered.length} orders`}
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers with smart ellipsis */}
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="w-7 h-7 flex items-center justify-center text-gray-400 text-xs select-none">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold transition-colors ${currentPage === page ? "bg-teal-500 text-white" : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 text-xs text-gray-300">
        <span>CLINICAL CLARITY MANAGEMENT SYSTEM V2.4.0</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-500 transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-gray-500 transition-colors">SUPPORT CENTER</a>
          <a href="#" className="hover:text-gray-500 transition-colors">SYSTEM STATUS</a>
        </div>
      </div>
    </main>
  );
}