import { Link, useParams } from "react-router-dom";
import { getStoredOrders } from "../utils/orderStorage";

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

function OrderDetail() {
  const { orderId } = useParams();
  const orders = getStoredOrders();
  const order = orders.find((item) => item.id === orderId);

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
              <h1 className="text-3xl font-bold text-slate-900">{order.id}</h1>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <p className="mt-2 text-slate-500">Ngày đặt: {order.date}</p>
            <p className="mt-2 text-slate-500">
              Đơn vị vận chuyển: {order.shippingUnit}
            </p>
            <p className="mt-2 text-slate-500">
              Mã vận đơn: {order.trackingCode}
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-500">Tổng thanh toán</p>
            <p className="mt-2 text-3xl font-bold text-teal-600">
              {order.total.toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {order.items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-slate-500">
                    {item.color} · Size {item.size}
                  </p>

                  <p className="mt-1 text-slate-500">
                    Số lượng: {item.quantity}
                  </p>

                  <p className="mt-1 text-slate-500">
                    Loại đơn: {getOrderTypeLabel(item.orderType)}
                  </p>

                  {item.orderType === "prescription" && item.prescription && (
                    <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">
                        Thông tin toa kính
                      </p>

                      <p className="mt-2">
                        SPH: trái {item.prescription.leftSPH} / phải{" "}
                        {item.prescription.rightSPH}
                      </p>

                      <p className="mt-1">
                        CYL: trái {item.prescription.leftCYL} / phải{" "}
                        {item.prescription.rightCYL}
                      </p>

                      <p className="mt-1">
                        AXIS: trái {item.prescription.leftAXIS} / phải{" "}
                        {item.prescription.rightAXIS}
                      </p>

                      <p className="mt-1">PD: {item.prescription.pd}</p>

                      <p className="mt-1">
                        Loại tròng: {item.prescription.lensType}
                      </p>

                      {item.prescription.note && (
                        <p className="mt-1">
                          Ghi chú: {item.prescription.note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-2xl font-bold text-slate-900">
                {item.price.toLocaleString("vi-VN")} đ
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;