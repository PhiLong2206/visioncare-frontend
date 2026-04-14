import { useEffect, useMemo, useState } from "react";
import { getStoredOrders } from "../../utils/orderStorage";

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
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "Tất cả") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Đơn hàng của tôi</h1>
          <p className="mt-2 text-slate-500">{filteredOrders.length} đơn hàng</p>
        </div>

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
              const firstItem = order.items?.[0];

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
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

                    <span className="w-fit rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700">
                      {getOrderTypeLabel(firstItem?.orderType)}
                    </span>
                  </div>

                  {firstItem && (
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

                          <p className="text-slate-500">x{firstItem.quantity}</p>

                          {firstItem.orderType === "prescription" && (
                            <p className="text-xs text-slate-500">
                              Có thông tin toa kính
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-2xl font-semibold text-slate-900">
                        {Number(firstItem.price || 0).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-3 text-slate-500">
                      <span>{order.shippingUnit || "Chưa cập nhật đơn vị vận chuyển"}</span>

                      <span className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
                        {order.trackingCode || "Chưa có mã vận đơn"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-3xl font-bold text-teal-600">
                        {Number(order.total || 0).toLocaleString("vi-VN")} đ
                      </p>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 text-lg text-slate-400 transition hover:text-slate-700"
            >
              ✖
            </button>

            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Chi tiết đơn {selectedOrder.id}
            </h2>

            <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 md:grid-cols-2">
              <div>
                <p className="font-medium text-slate-900">Khách hàng</p>
                <p>{selectedOrder.customerName || "Chưa có thông tin"}</p>
              </div>

              <div>
                <p className="font-medium text-slate-900">SĐT</p>
                <p>{selectedOrder.phone || "Chưa có thông tin"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="font-medium text-slate-900">Địa chỉ</p>
                <p>{selectedOrder.address || "Chưa có thông tin"}</p>
              </div>

              <div>
                <p className="font-medium text-slate-900">Thanh toán</p>
                <p>{selectedOrder.paymentMethod || "Chưa có thông tin"}</p>
              </div>

              <div>
                <p className="font-medium text-slate-900">Trạng thái</p>
                <span
                  className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <div>
                <p className="font-medium text-slate-900">Ngày đặt</p>
                <p>{selectedOrder.date || "Chưa có thông tin"}</p>
              </div>

              <div>
                <p className="font-medium text-slate-900">Vận chuyển</p>
                <p>{selectedOrder.shippingUnit || "Chưa cập nhật"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="font-medium text-slate-900">Mã vận đơn</p>
                <p>{selectedOrder.trackingCode || "Chưa có mã vận đơn"}</p>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">Sản phẩm</h3>

              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-xs text-slate-400">
                          Loại: {getOrderTypeLabel(item.orderType)}
                        </p>
                      </div>
                    </div>

                    <p className="whitespace-nowrap font-semibold text-slate-900">
                      {Number(item.price || 0).toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4 text-lg font-bold text-teal-600">
              <span>Tổng cộng</span>
              <span>
                {Number(selectedOrder.total || 0).toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;