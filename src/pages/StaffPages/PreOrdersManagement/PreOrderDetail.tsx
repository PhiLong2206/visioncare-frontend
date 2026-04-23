import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Clock,
  PhoneCall,
  ArrowRightCircle,
  Truck,
  RotateCcw,
  CheckCircle2,
  FileText,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../../components/ConfirmModal";
import {
  getReservationDetail,
  confirmFirstCall,
  sendToOps,
  notifyStockReady,
  releaseToShipping,
} from "../../../api/salesPreOrderAPI";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  reserved: { label: "Đã đặt cọc", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: CheckCircle2 },
  sent_to_ops: { label: "Chờ hàng về", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Package },
  stock_arrived: { label: "Hàng đã về", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Package },
  customer_notified: { label: "Chờ thanh toán", color: "bg-orange-100 text-orange-700 border-orange-200", icon: Clock },
  paid: { label: "Đã thanh toán đủ", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  released: { label: "Ops đang xử lý", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck },
  fulfilled: { label: "Hoàn tất", color: "bg-slate-100 text-slate-700 border-slate-200", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700 border-red-200", icon: RotateCcw },
};

const PreOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    action: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    action: () => {},
  });

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getReservationDetail(parseInt(id));
      setRes(data);
    } catch (error: any) {
      console.error("Fetch pre-order detail failed:", error);
      toast.error(error.message || "Không tải được chi tiết đặt chỗ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAction = async (actionFn: (id: number) => Promise<any>, successMsg: string) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      await actionFn(parseInt(id));
      toast.success(successMsg);
      await fetchDetail();
    } catch (error: any) {
      toast.error(error.message || "Thao tác thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          <span className="font-semibold text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Đang đồng bộ dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!res) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <p className="text-xl font-bold text-slate-400">Không tìm thấy thông tin đặt chỗ.</p>
      </div>
    );
  }

  const statusKey = res.status.toLowerCase();
  const config = STATUS_CONFIG[statusKey] || { label: res.status, color: "bg-slate-100 text-slate-700 border-slate-200", icon: Info };

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-6 text-slate-800">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <ChevronLeft size={14} />
               Danh sách đặt trước
            </button>
            <ChevronRight size={14} />
            <span className="font-bold text-teal-600">#{res.reservationCode}</span>
          </div>

          <h1 className="text-[28px] font-black tracking-tight text-slate-900 md:text-[32px] uppercase">
            Đặt trước #{res.reservationCode}
          </h1>

          <div className="mt-2 flex items-center gap-3">
             <span className={`inline-flex items-center gap-2 rounded-xl border px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm ${config.color}`}>
                {config.label}
             </span>
             <span className="text-[14px] text-slate-400 font-bold italic">Loại: Pre-order</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
           {statusKey === 'reserved' && (
             <button 
               onClick={() => setConfirmModal({
                 isOpen: true,
                 title: "Xác nhận Lần 1",
                 message: "Bạn đã thực hiện cuộc gọi xác nhận lần 1 với khách hàng này chưa?",
                 confirmText: "Đã gọi & Xác nhận",
                 action: () => handleAction(confirmFirstCall, "Đã xác nhận cuộc gọi Lần 1")
               })}
               disabled={isSubmitting}
               className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50"
             >
               <PhoneCall size={18} />
               <span>Xác nhận Lần 1</span>
             </button>
           )}

           {statusKey === 'confirmed' && (
             <button 
               onClick={() => setConfirmModal({
                 isOpen: true,
                 title: "Xác nhận chuyển Ops",
                 message: "Bạn chắc chắn muốn chuyển đơn đặt trước này sang bộ phận vận hành để kiểm tra kho và nhập hàng?",
                 confirmText: "Xác nhận chuyển",
                 action: () => handleAction(sendToOps, "Đã chuyển yêu cầu sang Ops")
               })}
               disabled={isSubmitting}
               className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-indigo-700 disabled:opacity-50"
             >
               <ArrowRightCircle size={18} />
               <span>Chuyển sang Ops</span>
             </button>
           )}

           {statusKey === 'stock_arrived' && (
             <button 
               onClick={() => setConfirmModal({
                 isOpen: true,
                 title: "Báo có hàng (Lần 2)",
                 message: "Xác nhận đã gọi điện thông báo cho khách hàng hàng đã về kho và yêu cầu thanh toán phần còn lại?",
                 confirmText: "Xác nhận đã báo",
                 action: () => handleAction(notifyStockReady, "Đã báo khách có hàng (Lần 2)")
               })}
               disabled={isSubmitting}
               className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-teal-700 disabled:opacity-50"
             >
               <PhoneCall size={18} />
               <span>Báo có hàng (Lần 2)</span>
             </button>
           )}

           {statusKey === 'customer_notified' && (
              <div className="inline-flex items-center gap-3 rounded-2xl bg-orange-50 border border-orange-200 px-6 py-3.5 text-sm font-black text-orange-700 italic uppercase">
                 <Clock size={18} className="animate-pulse" />
                 <span>Chờ khách thanh toán 70% còn lại...</span>
              </div>
           )}

           {statusKey === 'paid' && (
             <button 
               onClick={() => setConfirmModal({
                 isOpen: true,
                 title: "Chuyển đóng hàng",
                 message: "Hệ thống đã ghi nhận thanh toán đủ. Chuyển sang bộ phận Ops để thực hiện đóng gói và giao hàng?",
                 confirmText: "Xác nhận chuyển",
                 action: () => handleAction(releaseToShipping, "Đã chuyển Ops đóng hàng & vận đơn")
               })}
               disabled={isSubmitting}
               className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-purple-700 disabled:opacity-50"
             >
               <Truck size={18} />
               <span>Chuyển Ops đóng hàng & vận đơn</span>
             </button>
           )}

           {statusKey === 'sent_to_ops' && (
              <div className="inline-flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-6 py-3.5 text-sm font-black text-amber-700 italic uppercase">
                 <Clock size={18} className="animate-spin" />
                 <span>Đang chờ Ops báo có hàng...</span>
              </div>
           )}

           {statusKey === 'released' && (
              <div className="inline-flex items-center gap-3 rounded-2xl bg-purple-50 border border-purple-200 px-6 py-3.5 text-sm font-black text-purple-700 uppercase">
                 <Truck size={18} />
                 <span>Ops đang đóng hàng & vận chuyển</span>
              </div>
           )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-8 lg:col-span-4">
          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-teal-50 p-4 text-teal-600">
                <User size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{res.customerName}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Thông tin khách hàng</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <Mail size={18} />
                </div>
                <span className="font-bold text-slate-700">{res.customerEmail || "N/A"}</span>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <Phone size={18} />
                </div>
                <span className="font-bold text-slate-700">{res.customerPhone || "Chưa cập nhật"}</span>
              </div>

              <div className="pt-6 border-t border-slate-100">
                 <div className="flex items-start gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 mt-1 shrink-0">
                       <MapPin size={18} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Địa chỉ nhận hàng</span>
                       <p className="text-[15px] font-bold text-slate-800 leading-relaxed italic">{res.shippingAddress || "Chưa cung cấp địa chỉ nhận hàng."}</p>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                <ShoppingCart size={18} className="text-teal-600" />
                <span>Chi tiết sản phẩm</span>
              </div>
            </div>

            <div className="space-y-6">
               <div className="flex flex-col gap-2 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-start">
                     <span className="text-lg font-black text-slate-900 leading-tight uppercase mr-4">{res.productName || "Sản phẩm Pre-order"}</span>
                     <span className="text-sm font-black text-teal-600 bg-white border border-teal-100 px-3 py-1 rounded-xl shadow-sm">x{res.quantity}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                     <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-500 uppercase">{res.color || "Original"}</span>
                     <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-500 uppercase">{res.size || "Standard"}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-1">SKU: {res.variantSku}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-400">Đơn giá: {res.unitPrice.toLocaleString('vi-VN')} đ</span>
                     <span className="text-lg font-black text-slate-900">{(res.unitPrice * res.quantity).toLocaleString('vi-VN')} đ</span>
                  </div>
               </div>

               <div className="pt-6 border-t-2 border-dashed border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-500 uppercase">Ngày tạo:</span>
                     <span className="text-sm font-black text-slate-800">{new Date(res.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50 border border-teal-100">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Tiền cọc (30%)</span>
                        <div className="flex items-center gap-2 mt-1">
                           <div className={`h-2.5 w-2.5 rounded-full ${res.paidAt ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 animate-pulse'}`}></div>
                           <span className="text-xs font-black text-teal-800 uppercase italic">{res.paidAt ? 'Đã thu cọc' : 'Chờ thanh toán'}</span>
                        </div>
                     </div>
                     <span className="text-xl font-black text-teal-600">
                        {((res.unitPrice * res.quantity) * 0.3).toLocaleString('vi-VN')} đ
                     </span>
                  </div>
               </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 space-y-8 lg:col-span-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 md:p-10">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
                  <FileText size={28} className="text-teal-600" />
                  Toa kính & Chỉ số
                </h2>
                <p className="mt-2 text-[15px] font-medium text-slate-400 italic">
                  Kiểm tra các thông số kỹ thuật trước khi xác nhận đơn hàng sang sản xuất.
                </p>
              </div>

              <button 
                onClick={fetchDetail}
                className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition hover:bg-teal-50 hover:text-teal-600 border border-slate-100 shadow-sm"
              >
                <RotateCcw size={22} />
              </button>
            </div>

            <div className="rounded-3xl bg-slate-50 p-8 border border-slate-200">
               <div className="grid grid-cols-6 gap-4 mb-6 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-center">
                  <div className="text-left px-2">MẮT</div>
                  <div>CẦU (SPH)</div>
                  <div>LOẠN (CYL)</div>
                  <div>TRỤC (AXIS)</div>
                  <div>ADD</div>
                  <div>PD</div>
               </div>

               <div className="space-y-4">
                  <div className="p-8 text-center text-slate-400 font-bold italic bg-white rounded-[24px] border border-dashed border-slate-200 shadow-sm">
                     <div className="flex flex-col items-center gap-4 py-8">
                        <Package size={48} className="text-slate-100" strokeWidth={1} />
                        <p className="text-[15px]">Đang chờ khách hàng cập nhật thông tin đo mắt.</p>
                        <p className="text-[11px] uppercase tracking-widest text-slate-300">Hoặc sản phẩm không yêu cầu toa độ phức tạp.</p>
                     </div>
                  </div>
               </div>
               
               <p className="mt-8 text-[11px] text-center text-slate-400 font-black italic uppercase tracking-tighter opacity-60">
                 * Các thông số trên được trích xuất từ toa kính thực tế của khách hàng.
               </p>
            </div>

            <div className="mt-12 bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
               <div className="mb-6 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
                  <h4 className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">Ghi chú vận hành</h4>
               </div>
               
               <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 italic font-medium text-[15px] leading-relaxed text-slate-300">
                  <p>Lưu ý: Khách hàng đã thanh toán cọc {((res.unitPrice * res.quantity) * 0.3).toLocaleString('vi-VN')} đ qua PayOS.</p>
                  <p className="mt-2 text-teal-400 font-bold">Vui lòng gọi điện xác nhận lại địa chỉ giao hàng và thời gian nhận dự kiến khi hàng về kho.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          setConfirmModal({ ...confirmModal, isOpen: false });
          confirmModal.action();
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />
    </div>
  );
};

export default PreOrderDetail;
