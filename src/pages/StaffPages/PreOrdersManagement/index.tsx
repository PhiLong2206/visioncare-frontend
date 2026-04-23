import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getReservations,
} from "../../../api/salesPreOrderAPI";
import ModernHeader from "../../../components/ModernHeader";

type Reservation = {
  reservationId: number;
  reservationCode: string;
  campaignName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  variantSku: string;
  quantity: number;
  unitPrice: number;
  status: string;
  paidAt: string | null;
  fulfilledAt: string | null;
  createdAt: string;
};

const STATUS_CONFIG: Record<string, { label: string, color: string }> = {
  reserved: { label: "Đã đặt cọc", color: "bg-blue-50 text-blue-700 border-blue-200" },
  confirmed: { label: "Đã xác nhận", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  sent_to_ops: { label: "Chờ hàng về", color: "bg-amber-50 text-amber-700 border-amber-200" },
  stock_arrived: { label: "Hàng đã về", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  customer_notified: { label: "Chờ thanh toán", color: "bg-orange-50 text-orange-700 border-orange-200" },
  paid: { label: "Đã thanh toán đủ", color: "bg-green-50 text-green-700 border-green-200" },
  released: { label: "Ops đang xử lý", color: "bg-purple-50 text-purple-700 border-purple-200" },
  fulfilled: { label: "Hoàn tất", color: "bg-slate-50 text-slate-700 border-slate-200" },
  cancelled: { label: "Đã hủy", color: "bg-red-50 text-red-700 border-red-200" },
};

export default function PreOrdersManagement() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations(statusFilter === "All" ? undefined : statusFilter);
      setReservations(data || []);
      setCurrentPage(1);
    } catch (error: any) {
      console.error("Fetch reservations failed:", error);
      toast.error(error.message || "Không tải được danh sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const filtered = useMemo(() => {
    if (!searchTerm) return reservations;
    const s = searchTerm.toLowerCase();
    return reservations.filter(r => 
      r.reservationCode.toLowerCase().includes(s) || 
      r.customerName.toLowerCase().includes(s) ||
      (r.productName && r.productName.toLowerCase().includes(s))
    );
  }, [reservations, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc]">
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Quy trình đặt trước</h1>
            <p className="text-slate-500 mt-2 text-[15px]">Quản lý vòng đời đơn hàng pre-order từ lúc đặt cọc đến khi giao hàng.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Tìm mã đơn, tên khách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-[320px] rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-[15px] font-medium shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5"
              />
            </div>
            
            <div className="flex h-12 items-center bg-white border border-slate-200 rounded-2xl px-4 gap-2 shadow-sm focus-within:border-teal-500 transition-all">
              <Filter size={18} className="text-slate-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-[14px] font-bold text-slate-700 outline-none bg-transparent cursor-pointer"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="reserved">Đã đặt cọc</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="sent_to_ops">Đang tiến hành (Ops)</option>
                <option value="stock_arrived">Hàng đã về</option>
                <option value="paid">Đã thanh toán đủ</option>
              </select>
            </div>

            <button 
              onClick={fetchReservations}
              className="h-12 w-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm"
            >
              <Clock size={20} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider h-14 uppercase tracking-[0.1em]">Mã Đơn</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider h-14 uppercase tracking-[0.1em]">Khách Hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider h-14 uppercase tracking-[0.1em]">Ngày đặt</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider h-14 uppercase tracking-[0.1em]">Loại</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider h-14 uppercase tracking-[0.1em]">Sản phẩm</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 tracking-wider h-14 uppercase tracking-[0.1em]">Trạng Thái</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 tracking-wider h-14 uppercase tracking-[0.1em]">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic font-medium">
                {loading ? (
                  <tr><td colSpan={7} className="py-24 text-center text-slate-400">Đang đồng bộ dữ liệu...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={7} className="py-24 text-center text-slate-300">Không tìm thấy yêu cầu phù hợp.</td></tr>
                ) : paginated.map((res) => (
                  <tr key={res.reservationId} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => navigate(`/staff/pre-orders/${res.reservationId}`)}
                        className="text-teal-600 font-bold hover:text-teal-800 transition-colors"
                      >
                        #{res.reservationCode}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{res.customerName}</p>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">{res.customerEmail}</p>
                    </td>
                    <td className="px-6 py-5 text-slate-600 font-medium">
                      {new Date(res.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-100">
                        PRE-ORDER
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-800 text-[14px]">{res.productName || "Sản phẩm ẩn"}</p>
                      <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-tight">{res.variantSku}</p>
                    </td>
                    <td className="px-6 py-5">
                      {res.status && STATUS_CONFIG[res.status.toLowerCase()] ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-wide border shadow-sm ${STATUS_CONFIG[res.status.toLowerCase()].color}`}>
                          {STATUS_CONFIG[res.status.toLowerCase()].label}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-xs font-bold uppercase italic">Ẩn</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button 
                         onClick={() => navigate(`/staff/pre-orders/${res.reservationId}`)}
                         className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 transition-all shadow-sm shadow-slate-100"
                         title="Xem chi tiết"
                       >
                          <Eye size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
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
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-slate-100"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-xl text-[14px] font-bold bg-teal-500 border border-teal-500 text-white shadow-sm shadow-slate-100">
                {currentPage}
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-slate-100"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
