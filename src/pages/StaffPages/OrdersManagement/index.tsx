import { useState, useMemo, useEffect } from "react";
import { CircleCheck, CircleAlert, CircleMinus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { getAllOrders, Order, ORDER_TYPE_STYLES, ORDERS_PER_PAGE, PrescriptionStatus, STATUS_STYLES, TYPEITEMS, transStatus } from "../../../api/staffAPI/orderAPI";

const PRESCRIPTION_ICON: Record<PrescriptionStatus, React.ReactElement> = {
  Verified: (
    <span className="inline-flex items-center gap-1.5 text-teal-600 font-semibold text-sm bg-teal-50 px-3 py-1 rounded-full">
      <CircleCheck className="w-4 h-4" />
      Đã xác nhận
    </span>
  ),
  "Manual Check Required": (
    <span className="inline-flex items-center gap-1.5 text-orange-600 font-semibold text-sm bg-orange-50 px-3 py-1 rounded-full border border-orange-200/50 hover:bg-orange-100 transition-colors">
      <CircleAlert className="w-4 h-4" />
      Yêu cầu kiểm tra
    </span>
  ),
  "No Rx Attached": (
    <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium text-sm">
      <CircleMinus className="w-4 h-4" />
      Không có chỉ số
    </span>
  ),
};

export default function OrdersManagement() {
  const [orderTypeFilter, setOrderTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [orders, setOrders] = useState<Order[] | []>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Fetch orders failed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [orderTypeFilter, statusFilter]);

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
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quản lý đơn hàng</h1>
          <p className="text-slate-500 mt-2 text-[15px]">Quản lý, xác minh và theo dõi tất cả các đơn thuốc và quy trình cấp phát thuốc.</p>
        </div>
      </div>

      {/* Filters Form */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm px-6 py-5 mb-8">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[13px] font-bold text-slate-500 tracking-wider mb-2 uppercase">Lọc theo loại đơn</label>
            <select
              value={orderTypeFilter}
              onChange={(e) => handleFilterChange("orderType", e.target.value)}
              className="w-full text-[15px] font-medium border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
            >
              <option value="All">Tất cả loại (All)</option>
              <option value="ORDER">Kính bán sẵn (ORDER)</option>
              <option value="PRE-ORDER">Đặt trước (PRE-ORDER)</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[13px] font-bold text-slate-500 tracking-wider mb-2 uppercase">Trạng thái xử lý</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full text-[15px] font-medium border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
            >
              <option value="All">Tất cả trạng thái (All)</option>
              {TYPEITEMS.map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={handleReset}
              className="h-[46px] px-6 text-[15px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
            >
              Căn lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Mã Đơn</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Khách Hàng</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Ngày đặt</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Loại</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Thông Số Toa Kính</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider uppercase">Trạng Thái</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 tracking-wider uppercase">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium text-[15px]">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                    <span className="font-medium text-[15px]">Không có đơn hàng nào khớp với bộ lọc.</span>
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 text-[15px] hover:bg-slate-50/80 transition-colors last:border-0 group"
                  >
                    {/* ID */}
                    <td className="px-6 py-5">
                      <button
                        className="text-teal-600 font-bold hover:text-teal-800 transition-colors"
                        onClick={() => navigate(`/staff/orders/${order.id}`)}
                      >
                        #{order.orderCode || order.id}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{order.customer}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{order.email}</p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5 text-slate-600 font-medium">{order.date}</td>

                    {/* Order Type */}
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold tracking-wide uppercase shadow-sm border ${
                        order.orderType === "PRE-ORDER" 
                        ? "bg-purple-50 text-purple-700 border-purple-200" 
                        : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {order.orderType}
                      </span>
                    </td>

                    {/* Prescription */}
                    <td className="px-6 py-5">{PRESCRIPTION_ICON[order.prescription]}</td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold tracking-wide shadow-sm border ${
                        order.status === "AWAITING VERIFICATION" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        order.status === "SENT TO LAB" ? "bg-violet-50 text-violet-700 border-violet-200" :
                        order.status === "PROCESSING" ? "bg-cyan-50 text-cyan-700 border-cyan-200" :
                        order.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        {transStatus(order)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <button
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 shadow-sm transition-all shadow-slate-100"
                        title="Xem chi tiết"
                        onClick={() => navigate(`/staff/orders/${order.id}`)}
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[14px] font-medium text-slate-600">
            {filtered.length === 0
              ? "Không có dữ liệu"
              : `Hiển thị ${startItem}–${endItem} trong số ${filtered.length} đơn`}
          </p>

          <div className="flex items-center gap-1.5">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-slate-100"
            >
              <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>

            {/* Page numbers with smart ellipsis */}
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm font-bold select-none">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl text-[14px] font-bold transition-all shadow-sm shadow-slate-100 border ${
                    currentPage === page 
                      ? "bg-teal-500 border-teal-500 text-white" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-slate-100"
            >
              <ChevronRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}