import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredOrders } from "../utils/orderStorage";

const FILTERS = ["Tất cả", "Chờ xác nhận", "Đang xử lý", "Hoàn thành"];

function getStatusClass(status) {
  switch (status) {
    case "Hoàn thành":
      return "bg-green-50 text-green-600 border-green-200";
    case "Đang xử lý":
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

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "Tất cả") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Đơn hàng của tôi</h1>
        <p className="mt-2 text-slate-500">{filteredOrders.length} đơn hàng</p>
      </div>

      {/* FILTER */}
      <div className="mb-8 flex flex-wrap gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeFilter === filter
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* EMPTY */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Không có đơn hàng phù hợp
          </h2>
          <p className="mt-3 text-slate-500">
            Hãy thử chọn trạng thái khác để xem thêm đơn hàng.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const firstItem = order.items[0];

            return (
              <div
                key={order.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {order.id}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="mt-2 text-slate-500">{order.date}</p>
                  </div>

                  {/* 🔥 FIX: loại đơn */}
                  <span className="w-fit rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700">
                    {getOrderTypeLabel(firstItem.orderType)}
                  </span>
                </div>

                {/* PRODUCT */}
                <div className="mt-6 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                      <img
                        src={firstItem.image}
                        alt={firstItem.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {firstItem.name}
                      </h3>

                      <p className="text-slate-500">
                        x{firstItem.quantity}
                      </p>

                      {/* 🔥 nếu là kính theo toa */}
                      {firstItem.orderType === "prescription" && (
                        <p className="text-xs text-slate-500">
                          Có thông tin toa kính
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-2xl font-semibold text-slate-900">
                    {firstItem.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-3 text-slate-500">
                    <span>{order.shippingUnit}</span>

                    <span className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
                      {order.trackingCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-3xl font-bold text-teal-600">
                      {order.total.toLocaleString("vi-VN")} đ
                    </p>

                    <Link
                      to={`/orders/${order.id}`}
                      className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Orders;