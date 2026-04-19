import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ORDER_API = "/api/Orders";

const FILTERS = [
  "Tất cả",
  "Pending",
  "Confirmed",
  "Processing",
  "Shipping",
  "Completed",
];

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function getStatusClass(status) {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-600 border-green-200";
    case "Shipping":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Processing":
      return "bg-purple-50 text-purple-600 border-purple-200";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Confirmed":
      return "bg-cyan-50 text-cyan-600 border-cyan-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getAccessToken();

      if (!token) {
        toast.error("Bạn cần đăng nhập để xem đơn hàng.");
        setOrders([]);
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(ORDER_API, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        console.log("ORDERS API:", data);

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        toast.error("Không tải được đơn hàng.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "Tất cả") return orders;
    return orders.filter((o) => o.orderStatus === activeFilter);
  }, [orders, activeFilter]);

  if (loading) {
    return <div className="py-20 text-center">Đang tải đơn hàng...</div>;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>

        <div className="mt-6 flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 text-sm ${
                activeFilter === f ? "bg-black text-white" : "border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-slate-500">Chưa có đơn hàng nào.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              return (
                <div
                  key={order.orderId}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-bold">#{order.orderId}</h2>
                      <p className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-sm ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>Thanh toán: {order.paymentStatus}</div>
                    <div>Loại đơn: {order.orderType}</div>
                    <div>Đã thanh toán: {Number(order.paidAmount || 0).toLocaleString("vi-VN")} đ</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-teal-600">
                      {Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ
                    </p>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-lg border px-4 py-2"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-[600px] rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">
              Đơn #{selectedOrder.orderId}
            </h2>

            <p>Trạng thái: {selectedOrder.orderStatus}</p>
            <p>Thanh toán: {selectedOrder.paymentStatus}</p>
            <p>Loại đơn: {selectedOrder.orderType}</p>

            <div className="mt-4 space-y-2">
              {selectedOrder.items?.map((i) => (
                <div
                  key={i.orderItemId}
                  className="flex justify-between gap-4"
                >
                  <span>
                    {i.productName} ({i.variantColor} - {i.variantSize}) x{i.quantity}
                  </span>
                  <span>{Number(i.subtotal).toLocaleString("vi-VN")} đ</span>
                </div>
              ))}
            </div>

            <p className="mt-4 font-bold text-teal-600">
              Tổng: {Number(selectedOrder.totalAmount || 0).toLocaleString("vi-VN")} đ
            </p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 rounded border px-4 py-2"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;