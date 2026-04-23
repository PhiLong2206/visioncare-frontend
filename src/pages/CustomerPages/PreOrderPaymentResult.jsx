import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { checkPreOrderDepositPaymentStatus } from "../../api/customerPreOrderAPI";
import { checkCustomerOrderPaymentStatus } from "../../api/ordersAPI";

function readPendingPreOrderPayment() {
  try {
    return JSON.parse(localStorage.getItem("pendingPreOrderPayment") || "null");
  } catch {
    return null;
  }
}

function clearPendingPreOrderPayment() {
  localStorage.removeItem("pendingPreOrderPayment");
}

export default function PreOrderPaymentResult({ cancelled = false }) {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(!cancelled);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const paymentContext = useMemo(() => {
    const pendingPayment = readPendingPreOrderPayment();
    const reservationId = searchParams.get("reservationId") || pendingPayment?.reservationId;
    const orderId = searchParams.get("orderId");
    const paymentLinkId = searchParams.get("paymentLinkId") || pendingPayment?.paymentLinkId;
    const paymentType = searchParams.get("type") || pendingPayment?.type || "deposit";

    return { reservationId, orderId, paymentLinkId, paymentType };
  }, [searchParams]);

  const { reservationId, orderId, paymentLinkId, paymentType } = paymentContext;

  useEffect(() => {
    if (cancelled) {
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      const { reservationId, orderId, paymentLinkId, paymentType } = paymentContext;

      if (!paymentLinkId || (!reservationId && !orderId)) {
        setErrorMessage("Khong tim thay thong tin thanh toan.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let data;
        
        if (orderId) {
          // Verify standard order payment
          data = await checkCustomerOrderPaymentStatus(orderId, paymentLinkId);
          setResult(data);
          if (data?.isPaid || String(data?.status).toLowerCase() === "paid") {
            toast.success("Thanh toán đơn hàng thành công!");
          }
        } else {
          // Verify pre-order payment
          data = await checkPreOrderDepositPaymentStatus(
            reservationId,
            paymentLinkId,
            paymentType
          );
          setResult(data);
          if (data?.isPaid || String(data?.status).toLowerCase() === "paid" || String(data?.status).toLowerCase() === "finalpaid") {
            clearPendingPreOrderPayment();
            toast.success(
              paymentType === "final" 
                ? "Hoan tat thanh toan don hang pre-order." 
                : "Thanh toan dat coc pre-order thanh cong."
            );
          }
        }
      } catch (error) {
        console.error("Check payment failed:", error);
        setErrorMessage(error.message || "Khong kiem tra duoc thanh toan.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [cancelled, reservationId, orderId, paymentLinkId, paymentType]);

  const isPaid =
    result?.isPaid === true || 
    String(result?.status || "").toLowerCase() === "paid" || 
    String(result?.status || "").toLowerCase() === "finalpaid";

  const isFinal = paymentContext.paymentType === "final";

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        {loading ? (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Dang kiem tra thanh toan
            </h1>
          </>
        ) : cancelled ? (
          <>
            <h1 className="text-2xl font-bold text-amber-600">
              Ban da huy thanh toan {isFinal ? "con lai" : "dat coc"}
            </h1>
            <p className="mt-3 text-slate-500">
              Ban co the thuc hien lai thanh toan tu don pre-order.
            </p>
          </>
        ) : errorMessage ? (
          <>
            <h1 className="text-2xl font-bold text-red-600">
              Khong kiem tra duoc thanh toan
            </h1>
            <p className="mt-3 text-slate-500">{errorMessage}</p>
          </>
        ) : isPaid ? (
          <>
            <h1 className="text-2xl font-bold text-teal-600">
              {orderId 
                ? "Thanh toán thành công!" 
                : isFinal 
                  ? "Thanh toán hoàn tất!" 
                  : "Đặt cọc pre-order thành công"}
            </h1>
            <p className="mt-3 text-slate-500">
              {orderId
                ? `Đơn hàng #${orderId} đã được xác nhận thanh toán.`
                : isFinal 
                  ? "Đơn hàng đã được thanh toán đủ. Chúng tôi sẽ sớm bàn giao cho đơn vị vận chuyển."
                  : `Phiếu đặt chỗ #${reservationId} đã được ghi nhận thanh toán.`}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-amber-600">
              Thanh toán chưa hoàn tất
            </h1>
            <p className="mt-3 text-slate-500">
              Trạng thái hiện tại: {result?.status || "Chưa thanh toán"}
            </p>
          </>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/orders"
            className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Xem don hang
          </Link>
          <Link
            to="/products"
            className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Tiep tuc mua sam
          </Link>
        </div>
      </div>
    </section>
  );
}
