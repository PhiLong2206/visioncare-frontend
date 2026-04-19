import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function getStatusClass(status) {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-600 border-green-200";
    case "Processing":
      return "bg-cyan-50 text-cyan-600 border-cyan-200";
    case "Pending":
      return "bg-amber-50 text-amber-600 border-amber-200";
    case "Shipping":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Cancelled":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getOrderTypeLabel(orderType) {
  switch (orderType) {
    case "Online":
      return "Đơn online";
    case "Offline":
      return "Đơn tại cửa hàng";
    default:
      return orderType || "Không xác định";
  }
}

function OrderDetail() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/Orders/${orderId}`);
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        console.log("ORDER DETAIL API:", data);

        // nếu API trả object trực tiếp
        setOrder(data);

        // nếu backend trả { data: {...} } thì đổi thành:
        // setOrder(data.data);
      } catch (error) {
        console.error("Fetch order detail failed:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

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
          Quay lại đơn hàng
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        <span>←</span>
        <span>Quay lại đơn hàng</span>
      </Link>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                #{order.orderId}
              </h1>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusClass(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <p className="mt-2 text-slate-500">
              Ngày đặt: {new Date(order.orderDate).toLocaleString("vi-VN")}
            </p>

            <p className="mt-2 text-slate-500">
              Hình thức đơn: {getOrderTypeLabel(order.orderType)}
            </p>

            <p className="mt-2 text-slate-500">
              Trạng thái thanh toán: {order.paymentStatus}
            </p>

            <p className="mt-2 text-slate-500">
              Đã thanh toán: {Number(order.paidAmount || 0).toLocaleString("vi-VN")} đ
            </p>

            {order.preOrderDeadline && (
              <p className="mt-2 text-slate-500">
                Hạn pre-order:{" "}
                {new Date(order.preOrderDeadline).toLocaleString("vi-VN")}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-slate-500">Tổng thanh toán</p>
            <p className="mt-2 text-3xl font-bold text-teal-600">
              {Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.orderItemId}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-start md:justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {item.productName}
                </h2>

                <p className="mt-1 text-slate-500">
                  {item.variantColor} · Size {item.variantSize}
                </p>

                <p className="mt-1 text-slate-500">SKU: {item.sku}</p>

                <p className="mt-1 text-slate-500">
                  Số lượng: {item.quantity}
                </p>

                <p className="mt-1 text-slate-500">
                  Đơn giá: {Number(item.unitPrice).toLocaleString("vi-VN")} đ
                </p>

                {item.prescriptionId && (
                  <p className="mt-1 text-blue-600">
                    Có toa kính (Prescription ID: {item.prescriptionId})
                  </p>
                )}
              </div>

              <p className="text-2xl font-bold text-slate-900">
                {Number(item.subtotal).toLocaleString("vi-VN")} đ
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;