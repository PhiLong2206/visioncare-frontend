import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCustomerOrders } from "../../api/ordersAPI";
const FILTERS = [
  "Tất cả",
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang xử lý",
  "Đang giao hàng",
  "Hoàn thành",
  "Đã hủy",
];

function getAccessToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function getOrdersArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.value)) return data.value;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeCustomerOrderStatus(order) {
  const rawStatus = normalizeText(
    order?.orderStatus || order?.status || order?.shippingStatus
  );

  if (!rawStatus) return "Chờ xác nhận";
  if (rawStatus.includes("cancel")) return "Đã hủy";
  if (rawStatus.includes("paid")) return "Đã đặt cọc";
  if (rawStatus.includes("reserve")) return "Đặt chỗ thành công";
  if (rawStatus.includes("complete") || rawStatus.includes("deliver")) {
    return "Hoàn thành";
  }
  if (
    rawStatus.includes("shipping") ||
    rawStatus.includes("shipped") ||
    rawStatus.includes("delivery")
  ) {
    return "Đang giao hàng";
  }
  if (
    rawStatus.includes("pack") ||
    rawStatus.includes("lens") ||
    rawStatus.includes("process")
  ) {
    return "Đang xử lý";
  }
  if (rawStatus.includes("confirm")) return "Đã xác nhận";
  return "Chờ xác nhận";
}

function getStatusClass(status) {
  switch (status) {
    case "Đã đặt cọc":
    case "Hoàn thành":
      return "bg-green-50 text-green-700 border-green-200";
    case "Đặt chỗ thành công":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Đang giao hàng":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Đang xử lý":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Đã xác nhận":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "Đã hủy":
      return "bg-red-50 text-red-700 border-red-200";
    case "Chờ xác nhận":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

async function fetchOrdersFromApi() {
  const responseData = await getCustomerOrders();
  return getOrdersArray(responseData);
}

function getFriendlyOrdersError(message) {
  if (!message) return "Khong the tai don hang luc nay.";

  if (
    message.includes("Invalid column name") ||
    message.includes("System.String") ||
    message.includes("System.Int32")
  ) {
    return "Backend dang loi schema du lieu don hang. Can sua API /api/Orders de tai danh sach.";
  }

  return message;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN");
}

function formatDate(value) {
  if (!value) return "--";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "--";

  return parsedDate.toLocaleString("vi-VN");
}

function resolveOrderId(order) {
  return order?.orderId || order?.id || order?.orderCode || order?.code;
}

function resolveOrderCode(order) {
  return (
    order?.orderCode ||
    order?.code ||
    (resolveOrderId(order) ? `#${resolveOrderId(order)}` : "#--")
  );
}

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      const token = getAccessToken();
      if (!token) {
        if (!isMounted) return;
        setOrders([]);
        setErrorMessage("Ban can dang nhap de xem don hang.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");
        const data = await fetchOrdersFromApi();

        if (!isMounted) return;
        setOrders(data);
      } catch (error) {
        const friendlyMessage = getFriendlyOrdersError(error.message);
        console.error("Fetch orders error:", error);

        if (!isMounted) return;
        setOrders([]);
        setErrorMessage(friendlyMessage);
        toast.error(friendlyMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedStatus = normalizeCustomerOrderStatus(order);
      if (activeFilter === "Tất cả") return true;
      return normalizedStatus === activeFilter;
    });
  }, [activeFilter, orders]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Đơn hàng của tôi</h1>

        <div className="flex flex-wrap gap-3">
          {FILTERS.map((filter) => {
            const isActive = filter === activeFilter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-5 py-3 text-lg transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-900 hover:border-slate-400"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h2 className="text-xl font-semibold">Không tải được đơn hàng</h2>
          <p className="mt-2 leading-7">{errorMessage}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center text-lg text-slate-500 shadow-sm">
          Đang tải đơn hàng...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center text-lg text-slate-500 shadow-sm">
          Chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {filteredOrders.map((order, index) => {
            const orderId = resolveOrderId(order);
            const normalizedStatus = normalizeCustomerOrderStatus(order);

            return (
              <article
                key={`${resolveOrderCode(order)}-${orderId || index}`}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {resolveOrderCode(order)}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusClass(
                          normalizedStatus
                        )}`}
                      >
                        {normalizedStatus}
                      </span>
                    </div>

                    <p className="mt-2 text-slate-500">
                      Ngày đặt: {formatDate(order?.orderDate || order?.createdAt)}
                    </p>

                    <p className="mt-2 text-slate-500">
                      Thanh toán: {order?.paymentStatus || "Chưa rõ"}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-slate-500">Tổng thanh toán</p>
                    <p className="mt-2 text-3xl font-bold text-teal-600">
                      {formatCurrency(order?.totalAmount)} đ
                    </p>
                  </div>
                </div>

                {Array.isArray(order?.items) && order.items.length > 0 ? (
                  <div className="mt-6 space-y-3 border-t border-slate-200 pt-4">
                    {order.items.slice(0, 3).map((item, itemIndex) => (
                      <div
                        key={`${item?.orderItemId || item?.id || itemIndex}`}
                        className="flex items-center justify-between gap-4 text-sm text-slate-600"
                      >
                        <p className="line-clamp-1 flex-1">
                          {item?.productName || item?.name || "Sản phẩm"}
                        </p>
                        <p>x{item?.quantity || 1}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!orderId) {
                        toast.error("Đơn hàng này chưa có id hợp lệ.");
                        return;
                      }

                      navigate(`/orders/${orderId}`);
                    }}
                    className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:border-slate-400"
                  >
                    Chi tiết
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Orders;

