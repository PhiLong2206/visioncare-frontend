import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyReservations, createFinalPaymentLink, completeConvertedOrder } from "../../api/customerPreOrderAPI";

const STATUS_MAP = {
  reserved: { label: "Đã đặt chỗ", color: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Đã thanh toán đủ", color: "bg-green-50 text-green-700 border-green-200" },
  sent_to_ops: { label: "Đang chuẩn bị hàng", color: "bg-amber-50 text-amber-700 border-amber-200" },
  stock_arrived: { label: "Hàng đã về kho", color: "bg-teal-50 text-teal-700 border-teal-200" },
  customer_notified: { label: "Chờ thanh toán 70%", color: "bg-orange-50 text-orange-700 border-orange-200" },
  released: { label: "Đang xử lý / Chờ đóng gói", color: "bg-slate-50 text-slate-700 border-slate-200" },
  packed: { label: "Sẵn sàng giao hàng", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  shipping: { label: "Đang giao hàng", color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
  delivered: { label: "Đã giao hàng", color: "bg-teal-50 text-teal-700 border-teal-200" },
  fulfilled: { label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Đã hủy", color: "bg-red-50 text-red-700 border-red-200" },
};

function getStatusInfo(status) {
  return (
    STATUS_MAP[status?.toLowerCase()] || {
      label: status || "Không rõ",
      color: "bg-slate-50 text-slate-600 border-slate-200",
    }
  );
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function formatDate(value) {
  if (!value) return "--";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "--" : d.toLocaleString("vi-VN");
}

export default function MyPreOrders() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
    if (!token) {
      navigate("/login");
      return;
    }
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      setLoading(true);
      const data = await getMyReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Không tải được danh sách đặt trước.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }

  // Tạo link PayOS rồi điều hướng sang trang chọn phương thức
  async function handlePayNow(r) {
    try {
      setLoadingPayment(r.reservationId);
      const result = await createFinalPaymentLink(r.reservationId);

      // Điều hướng đến trang PaymentSimulation giống flow đặt cọc
      navigate("/payment-simulation", {
        state: {
          reservationId: r.reservationId,
          paymentLinkId: result?.paymentLinkId || "",
          checkoutUrl: result?.checkoutUrl || "",
          amount: r.remainingAmount,
          orderType: "Pre-order",
          paymentType: "final", // flag để PaymentSimulation biết dùng simulate-final-payment
        },
      });
    } catch (err) {
      toast.error(err.message || "Không tạo được link thanh toán.");
    } finally {
      setLoadingPayment(null);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Đơn Đặt Trước (Pre-order)</h1>
        <p className="mt-2 text-slate-500">
          Theo dõi trạng thái và hoàn tất thanh toán các đơn đặt trước của bạn.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">
          Đang tải danh sách đặt trước...
        </div>
      ) : reservations.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">
          <div className="mb-4 text-5xl">📦</div>
          <p className="text-lg font-medium">Chưa có đơn đặt trước nào.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            Xem sản phẩm
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {reservations.map((r) => {
            const statusInfo = getStatusInfo(r.status);
            const isCustomerNotified = r.status?.toLowerCase() === "customer_notified";
            const isLoading = loadingPayment === r.reservationId;

            return (
              <article
                key={r.reservationId}
                className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-900">{r.reservationCode}</h2>
                      <span className={`rounded-full border px-3 py-1 text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Đặt ngày: {formatDate(r.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Tổng giá trị</p>
                    <p className="text-2xl font-bold text-teal-600">{formatCurrency(r.totalAmount)}</p>
                  </div>
                </div>

                {/* Product info */}
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{r.productName}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
                    {r.color && (
                      <span className="rounded-md bg-white px-2 py-0.5 border border-slate-200">{r.color}</span>
                    )}
                    {r.size && (
                      <span className="rounded-md bg-white px-2 py-0.5 border border-slate-200">Size {r.size}</span>
                    )}
                    <span className="rounded-md bg-white px-2 py-0.5 border border-slate-200">SL: {r.quantity}</span>
                  </div>
                </div>

                {/* Payment breakdown */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl bg-green-50 p-3 text-center">
                    <p className="text-green-600 font-medium text-xs uppercase tracking-wide">Đã đặt cọc 30%</p>
                    <p className="mt-1 font-bold text-green-700">{formatCurrency(r.depositAmount)}</p>
                  </div>
                  <div className={`rounded-2xl p-3 text-center ${isCustomerNotified ? "bg-orange-50" : "bg-slate-50"}`}>
                    <p className={`font-medium text-xs uppercase tracking-wide ${isCustomerNotified ? "text-orange-600" : "text-slate-400"}`}>
                      Còn lại 70%
                    </p>
                    <p className={`mt-1 font-bold ${isCustomerNotified ? "text-orange-700" : "text-slate-500"}`}>
                      {formatCurrency(r.remainingAmount)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-slate-400 font-medium text-xs uppercase tracking-wide">Tổng cộng</p>
                    <p className="mt-1 font-bold text-slate-700">{formatCurrency(r.totalAmount)}</p>
                  </div>
                </div>

                {/* CTA: Pay remaining 70% */}
                {isCustomerNotified && (
                  <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-orange-800">🎉 Hàng đã về! Thanh toán để nhận hàng</p>
                      <p className="text-sm text-orange-600 mt-1">
                        Vui lòng thanh toán số tiền còn lại{" "}
                        <strong>{formatCurrency(r.remainingAmount)}</strong> để hoàn tất đơn đặt trước. 
                        Chúng tôi sẽ tiến hành đóng gói và giao hàng ngay sau khi bạn hoàn tất.
                      </p>
                    </div>
                    <button
                      onClick={() => handlePayNow(r)}
                      disabled={isLoading}
                      className="shrink-0 rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Đang tạo link...
                        </>
                      ) : (
                        "Thanh toán ngay"
                      )}
                    </button>
                  </div>
                )}
                {/* CTA: Confirm Receipt */}
                {r.status?.toLowerCase() === "delivered" && r.convertedOrderId && (
                  <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-teal-800">✅ Hàng đã giao đến bạn</p>
                      <p className="text-sm text-teal-600 mt-1">
                        Vui lòng kiểm tra sản phẩm và xác nhận đã nhận hàng.
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await completeConvertedOrder(r.convertedOrderId);
                          toast.success("Xác nhận nhận hàng thành công!");
                          fetchReservations();
                        } catch (err) {
                          toast.error(err.message || "Không thể xác nhận.");
                        }
                      }}
                      className="shrink-0 rounded-2xl bg-teal-500 px-6 py-3 font-semibold text-white shadow-md shadow-teal-200 transition hover:bg-teal-600"
                    >
                      Đã nhận được hàng
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
