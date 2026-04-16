import { useEffect, useMemo, useState } from "react";
import {
  getStoredOrders,
  saveOrders,
} from "../../utils/orderStorage";

const FILTERS = [
  "Tất cả",
  "Chờ xác nhận",
  "Đã xác nhận",
  "Chờ nhập hàng",
  "Đang gia công",
  "Đang giao hàng",
  "Hoàn thành",
];

function getStatusClass(status) {
  switch (status) {
    case "Hoàn thành":
      return "bg-green-50 text-green-600 border-green-200";
    case "Đang giao hàng":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Đang gia công":
      return "bg-purple-50 text-purple-600 border-purple-200";
    case "Chờ nhập hàng":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Đã xác nhận":
      return "bg-cyan-50 text-cyan-600 border-cyan-200";
    case "Chờ xác nhận":
      return "bg-amber-50 text-amber-600 border-amber-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getOrderTypeLabel(orderType) {
  switch (orderType) {
    case "in-stock":
      return "Mua thường";
    case "pre-order":
      return "Đặt trước";
    case "prescription":
      return "Kính theo toa";
    default:
      return "Không xác định";
  }
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "Tất cả") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  // ✅ confirm nhận hàng (customer)
  const handleConfirmReceived = (orderId) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: "Hoàn thành" } : o
    );

    setOrders(updated);
    saveOrders(updated);

    setSelectedOrder((prev) =>
      prev?.id === orderId ? { ...prev, status: "Hoàn thành" } : prev
    );
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>

        {/* FILTER */}
        <div className="mt-6 flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeFilter === f
                  ? "bg-black text-white"
                  : "border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => {
            const hasPre = order.items.some(i => i.orderType === "pre-order");
            const hasPrescription = order.items.some(i => i.orderType === "prescription");

            return (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm">

                {/* HEADER */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{order.id}</h2>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-sm border ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* WARNING */}
                {hasPre && (
                  <p className="mt-2 text-sm text-amber-600">
                    ⚠️ Đơn có sản phẩm đặt trước
                  </p>
                )}

                {hasPrescription && (
                  <p className="text-sm text-blue-600">
                    👓 Đơn cần gia công kính
                  </p>
                )}

                {/* FOOTER */}
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xl font-bold text-teal-600">
                    {order.total.toLocaleString("vi-VN")} đ
                  </p>

                  <div className="flex gap-2">
                    {order.status === "Đang giao hàng" && (
                      <button
                        onClick={() => handleConfirmReceived(order.id)}
                        className="bg-teal-500 text-white px-4 py-2 rounded-lg"
                      >
                        Đã nhận hàng
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="border px-4 py-2 rounded-lg"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-[600px]">
            <h2 className="text-xl font-bold mb-4">
              {selectedOrder.id}
            </h2>

            <p>{selectedOrder.customerName}</p>
            <p>{selectedOrder.phone}</p>
            <p>{selectedOrder.address}</p>

            <div className="mt-4">
              {selectedOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {i.name} ({getOrderTypeLabel(i.orderType)})
                  </span>
                  <span>{i.price.toLocaleString()} đ</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 border px-4 py-2 rounded"
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