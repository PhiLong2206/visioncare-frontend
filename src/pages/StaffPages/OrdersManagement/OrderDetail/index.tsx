import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Send,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  FileText,
  MessageSquare,
  CircleCheck,
  CircleAlert,
  CircleMinus,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../../../components/ConfirmModal";
import { 
  getStaffOrderDetail, 
  confirmOrder, 
  assignOrderToOps,
  Order,
  PrescriptionStatus,
  transStatus
} from "../../../../api/staffAPI/orderAPI";
import { verifyPrescription } from "../../../../api/salesPrescriptionAPI";

const PRESCRIPTION_ICON: Record<PrescriptionStatus, React.ReactElement> = {
  Verified: (
    <span className="inline-flex items-center gap-1 text-teal-600 font-medium text-sm">
      <CircleCheck className="w-4 h-4" />
      Đã xác nhận
    </span>
  ),
  "Manual Check Required": (
    <span className="inline-flex items-center gap-1 text-orange-500 font-medium text-sm">
      <CircleAlert className="w-4 h-4" />
      Cần kiểm tra
    </span>
  ),
  "No Rx Attached": (
    <span className="inline-flex items-center gap-1 text-gray-400 font-medium text-sm">
      <CircleMinus className="w-4 h-4" />
      Không có toa
    </span>
  ),
};

const StaffOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffNote, setStaffNote] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getStaffOrderDetail(id);
      setOrder(data);
      setStaffNote(data.staffNote || "");
    } catch (error: any) {
      console.error("Fetch order detail failed:", error);
      toast.error(error.message || "Không tải được chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleConfirmOrder = async () => {
    if (!id) return;

    if (order?.prescription === "Manual Check Required") {
      toast.error("Vui lòng xác minh toa kính trước khi xác nhận đơn hàng.");
      return;
    }

    try {
      setIsSubmitting(true);
      await confirmOrder(id, staffNote);
      toast.success("Xác nhận đơn hàng thành công!");
      await fetchOrder();
    } catch (error: any) {
      toast.error(error.message || "Xác nhận thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPrescription = async () => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await verifyPrescription(id, {
        isVerified: true,
        notes: staffNote || "Toa kính đã được kiểm tra trên màn chi tiết đơn hàng.",
      });
      toast.success("Đã xác minh toa kính.");
      await fetchOrder();
    } catch (error: any) {
      toast.error(error.message || "Không xác minh được toa kính.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignToOps = async () => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await assignOrderToOps(id, staffNote);
      toast.success("Đã gửi đơn cho bộ phận vận hành!");
      await fetchOrder();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi giao sang kĩ thuật.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          <span className="font-semibold text-slate-500">Đang tải dữ liệu đơn hàng...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <p className="text-xl font-bold text-slate-400">Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  const isPending = order.status === "AWAITING VERIFICATION";
  const isConfirmed = order.status === "SENT TO LAB";
  const prescriptionItem = order.items?.find((item) => item.prescriptionId);
  const needsPrescriptionCheck =
    prescriptionItem && order.prescription === "Manual Check Required";

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-6 text-slate-800">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Link
              to="/staff"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <ChevronLeft size={14} />
              Quay lại danh sách
            </Link>
            <ChevronRight size={14} />
            <span className="font-semibold text-teal-600">#{order.orderCode || order.id}</span>
          </div>

          <h1 className="text-[28px] font-bold tracking-tight text-slate-900 md:text-[32px]">
            Đơn hàng #{order.orderCode || order.id}
          </h1>

          <p className="mt-1 text-[15px] text-slate-500">
            Trạng thái hiện tại: <span className="font-bold text-slate-900">{transStatus(order)}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {needsPrescriptionCheck && (
            <button
              onClick={handleVerifyPrescription}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-600 disabled:opacity-50"
            >
              <CircleAlert size={18} />
              <span>Xác minh toa kính</span>
            </button>
          )}

          {isPending && (
            <button 
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-teal-700 disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              <span>Xác nhận đơn hàng</span>
            </button>
          )}

          {isConfirmed && (
            <button 
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
            >
              <Send size={18} />
              <span>Giao sang bộ phận Kĩ thuật/Kho</span>
            </button>
          )}

          {order.status === "PROCESSING" && (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-200 px-6 py-3 text-sm font-bold text-slate-500">
              <RotateCcw size={18} />
              <span>Đang được xử lý kĩ thuật</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{order.customer}</h2>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Khách hàng</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Mail size={16} className="text-slate-400" />
                <span className="font-medium">{order.email}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone size={16} className="text-slate-400" />
                <span className="font-medium text-slate-500">Thông tin liên hệ: Chưa cập nhật</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-700 pt-2 border-t border-slate-100">
                <MapPin size={16} className="mt-1 shrink-0 text-slate-400" />
                <div className="flex flex-col gap-1">
                   <span className="text-xs font-bold text-slate-400 uppercase">Địa chỉ nhận hàng</span>
                   <span className="leading-relaxed font-medium">{order.shippingAddress || "Chưa cung cấp địa chỉ"}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                <ShoppingCart size={16} />
                <span>Chi tiết giỏ hàng</span>
              </div>
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                {order.items?.length || 0} SẢN PHẨM
              </span>
            </div>

            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-slate-900 leading-tight flex-1 mr-4">{item.productName}</span>
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">x{item.quantity}</span>
                  </div>
                  <span className="text-xs text-slate-500">{item.variantInfo}</span>
                  <div className="flex items-center justify-between mt-1">
                     <span className="text-[11px] text-slate-400 font-medium">Đơn giá: {item.unitPrice.toLocaleString()} VND</span>
                     <span className="text-xs font-bold text-slate-700">{(item.unitPrice * item.quantity).toLocaleString()} VND</span>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-slate-100 pt-5">
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-400 uppercase">Tổng cộng</span>
                   <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${order.paymentStatus.toLowerCase() === 'paid' ? 'bg-teal-500' : 'bg-amber-500'}`}></span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{order.paymentStatus}</span>
                   </div>
                </div>
                <span className="text-2xl font-black text-teal-600">
                  {order.totalAmount.toLocaleString()} đ
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <FileText size={24} className="text-teal-600" />
                  Toa kính & Chỉ số
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Kiểm tra các thông số kỹ thuật trước khi xác nhận đơn hàng sang sản xuất.
                </p>
              </div>

              <div className="flex items-center gap-2">
                 {PRESCRIPTION_ICON[order.prescription]}
                 <button 
                  onClick={() => fetchOrder()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                 >
                  <RotateCcw size={18} />
                 </button>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
               <div className="grid grid-cols-6 gap-4 mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">
                  <div className="text-left">MẮT</div>
                  <div>CẦU (SPH)</div>
                  <div>LOẠN (CYL)</div>
                  <div>TRỤC (AXIS)</div>
                  <div>ADD</div>
                  <div>PD</div>
               </div>

                {prescriptionItem ? (
                  <div className="space-y-3">
                      <React.Fragment>
                        <div className="grid grid-cols-6 gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 italic">
                          <div className="col-span-6 text-[10px] text-teal-600 font-bold mb-1 uppercase tracking-tighter">Sản phẩm: {prescriptionItem.productName}</div>
                          <div className="flex items-center gap-3 text-center">
                            <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black">OD</div>
                            <span className="text-xs font-bold text-slate-400">PHẢI</span>
                          </div>
                          <div className="text-center font-bold text-slate-700">{prescriptionItem.odSphere ?? "0.00"}</div>
                          <div className="text-center font-bold text-slate-700">{prescriptionItem.odCylinder ?? "0.00"}</div>
                          <div className="text-center font-bold text-slate-700">{prescriptionItem.odAxis ?? "0"}</div>
                          <div className="text-center font-bold text-slate-700">-</div>
                          <div className="text-center font-bold text-slate-700">{prescriptionItem.pd ?? "-"}</div>
                        </div>

                        <div className="grid grid-cols-6 gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 italic">
                          <div className="flex items-center gap-3 text-center">
                            <div className="h-8 w-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white text-[10px] font-black">OS</div>
                            <span className="text-xs font-bold text-slate-400">TRÁI</span>
                          </div>
                          <div className="text-center font-bold text-slate-700">{prescriptionItem.osSphere ?? "0.00"}</div>
                          <div className="text-center font-bold text-slate-700">{prescriptionItem.osCylinder ?? "0.00"}</div>
                          <div className="text-center font-bold text-slate-700">{prescriptionItem.osAxis ?? "0"}</div>
                          <div className="text-center font-bold text-slate-700">-</div>
                          <div className="text-center font-bold text-slate-700">-</div>
                        </div>
                        {prescriptionItem.prescriptionNote && (
                          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-700">
                            Ghi chú toa: {prescriptionItem.prescriptionNote}
                          </div>
                        )}
                      </React.Fragment>
                  </div>
                ) : (
                 <div className="p-6 text-center text-slate-400 font-medium italic bg-white rounded-2xl border border-dashed border-slate-200">
                    Sản phẩm này không yêu cầu toa kính.
                 </div>
               )}
               
               <p className="mt-4 text-[11px] text-center text-slate-400 font-medium italic">
                 * Các thông số trên được trích xuất từ toa kính thực tế của khách hàng.
               </p>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-slate-500" />
                <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-600">
                  Ghi chú nội bộ
                </h4>
              </div>

              <textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="Nhập ghi chú quan trọng cho bộ phận vận hành hoặc kĩ thuật..."
                className="h-32 w-full resize-none rounded-[20px] border-2 border-slate-100 bg-slate-50 p-5 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white"
              />
              
              {order.staffNote && (
                <div className="mt-3 p-4 bg-teal-50 border border-teal-100 rounded-xl">
                   <p className="text-[11px] font-bold text-teal-600 uppercase mb-1">Ghi chú trước đó:</p>
                   <p className="text-sm text-teal-800 whitespace-pre-wrap">{order.staffNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleAssignToOps}
        title="Bàn giao vận hành"
        message="Bạn chắc chắn muốn giao đơn này sang bộ phận Kĩ thuật/Kho để tiến hành xử lý?"
        confirmText="Xác nhận giao"
      />
    </div>
  );
};

export default StaffOrderDetail;
