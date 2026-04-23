import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  completeCustomerOrder,
  getCustomerOrderDetail,
} from "../../api/ordersAPI";

const STEPS = [
  { key: "Pending", label: "ĐÃ ĐẶT HÀNG" },
  { key: "Confirmed", label: "ĐÃ XÁC NHẬN" },
  { key: "Processing", label: "ĐANG XỬ LÝ" },
  { key: "Shipped", label: "ĐANG GIAO HÀNG" },
  { key: "Completed", label: "HOÀN THÀNH" },
];

function getStatusIndex(status) {
  switch (status) {
    case "Pending":
      return 0;
    case "Confirmed":
      return 1;
    case "Processing":
    case "Packed":
      return 2;
    case "Shipped":
      return 3;
    case "Delivered":
    case "Completed":
      return 4;
    default:
      return -1;
  }
}

function getVietnameseStatus(status) {
  switch (status) {
    case "Pending":
      return "CHỜ XÁC NHẬN";
    case "Confirmed":
      return "ĐÃ XÁC NHẬN";
    case "Processing":
    case "Packed":
      return "ĐANG XỬ LÝ";
    case "Shipped":
      return "ĐANG GIAO HÀNG";
    case "Delivered":
      return "ĐÃ GIAO HÀNG";
    case "Completed":
      return "HOÀN THÀNH";
    case "Cancelled":
      return "ĐÃ HỦY";
    default:
      return status?.toUpperCase() || "KHÔNG RÕ";
  }
}

function OrderDetail() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);

        const data = await getCustomerOrderDetail(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Fetch order detail failed:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleConfirmReceipt = async () => {
    setShowConfirmModal(false);
    try {
      await completeCustomerOrder(orderId);

      toast.success("Xác nhận nhận hàng thành công!");
      setOrder((prev) => ({ ...prev, orderStatus: "Delivered" }));
    } catch (error) {
      console.error("Confirm receipt failed:", error);
      toast.error(error.message || "Không thể xác nhận nhận hàng");
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900">
          Đang tải đơn hàng...
        </h1>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900">
          Không tìm thấy đơn hàng
        </h1>
        <Link
          to="/orders"
          className="mt-4 inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white"
        >
          Quay lại danh sách
        </Link>
      </section>
    );
  }

  const currentStepIndex = getStatusIndex(order.orderStatus);
  const isCancelled = order.orderStatus === "Cancelled";

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 bg-slate-50 min-h-screen">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        <span>←</span>
        <span>Quay lại danh sách</span>
      </Link>

      <div className="flex flex-col gap-6">
        {/* Top Header Card */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  Đơn hàng #{order.orderId}
                </h1>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-wider text-slate-600 uppercase">
                  {getVietnameseStatus(order.orderStatus)}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Đặt ngày {new Date(order.orderDate).toLocaleString("vi-VN")}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                TỔNG THANH TOÁN
              </p>
              <p className="mt-1 text-3xl font-bold text-teal-600">
                {Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-8">
            {isCancelled ? (
              <div className="text-center py-4">
                <p className="text-lg font-semibold text-red-500">ĐƠN HÀNG ĐÃ HỦY</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-5 left-0 h-[2px] w-full bg-slate-100"></div>
                <div
                  className="absolute top-5 left-0 h-[2px] bg-teal-500 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 100)}%`,
                  }}
                ></div>

                <div className="relative flex justify-between">
                  {STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isActive = index === currentStepIndex;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-colors duration-300 ${
                            isCompleted
                              ? "border-teal-500 text-teal-500"
                              : "border-slate-200 text-slate-300"
                          }`}
                        >
                          {isActive ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : isCompleted ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                          )}
                        </div>
                        <p
                          className={`mt-3 text-xs font-semibold tracking-wide uppercase transition-colors duration-300 ${
                            isCompleted ? "text-slate-800" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {order.orderStatus === "Shipped" && !isCancelled && (
              <div className="mt-8 flex justify-center border-t border-slate-100 pt-6">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="rounded-full bg-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Xác nhận đã nhận hàng
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom 2-Column Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
          
          {/* Products Column */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Sản phẩm trong đơn
            </h2>
            
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                    {/* Placeholder for item image */}
                    <svg className="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {item.productName}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-md bg-slate-100 px-2 py-1">
                        {item.variantColor || "Khác"} • Size {item.variantSize || "Chung"}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1">
                        SL: {item.quantity}
                      </span>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-slate-900 sm:text-right">
                    {Number(item.subtotal).toLocaleString("vi-VN")} đ
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            
            {/* Shipping Info */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Thông tin giao hàng
              </h2>
              
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900 text-sm">Người nhận (Cập nhật sau...)</p>
                <p className="mt-1 text-sm text-slate-500">Vui lòng kiểm tra địa chỉ dưới đây</p>
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {order.shippingAddress || "Chưa có địa chỉ giao hàng"}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
               <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Thanh toán
              </h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Hình thức</span>
                  <span className="font-bold text-teal-600">Chuyển khoản ngân hàng</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-500">Trạng thái</span>
                  <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-teal-600' : 'text-amber-600'}`}>
                    {order.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium text-slate-700">Đã thanh toán</span>
                  <span className="font-bold text-slate-900">
                    {Number(order.paidAmount || 0).toLocaleString("vi-VN")} đ
                  </span>
                </div>

                {order.paymentStatus !== "Paid" && order.orderStatus === "Pending" && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={async () => {
                        const { createCustomerOrderPaymentLink } = await import("../../api/ordersAPI");
                        try {
                          toast.loading("Đang tạo link thanh toán...", { id: "payment-link" });
                          const link = await createCustomerOrderPaymentLink(order.orderId);
                          toast.dismiss("payment-link");
                          
                          if (link?.checkoutUrl) {
                            navigate("/payment-simulation", {
                              state: {
                                orderId: order.orderId,
                                checkoutUrl: link.checkoutUrl,
                                amount: order.totalAmount,
                                orderType: "Ready-made",
                                paymentLinkId: link.paymentLinkId
                              },
                            });
                          }
                        } catch (err) {
                          toast.dismiss("payment-link");
                          toast.error("Không tạo được link thanh toán.");
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-600 py-4 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Thanh toán ngay
                    </button>
                    <p className="mt-3 text-center text-[11px] text-slate-400 italic">
                      Hỗ trợ PayOS QR & Giả lập thanh toán cho Demo
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Custom confirm modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 mx-auto">
              <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-center text-xl font-bold text-slate-900">Xác nhận nhận hàng</h3>
            <p className="mt-2 text-center text-sm text-slate-500">
              Bạn xác nhận đã nhận được hàng và hàng đúng yêu cầu?<br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Huỷ
              </button>
              <button
                onClick={handleConfirmReceipt}
                className="flex-1 rounded-2xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OrderDetail;



