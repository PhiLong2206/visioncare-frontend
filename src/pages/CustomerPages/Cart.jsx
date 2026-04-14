import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";


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

function Cart() {
  const { cartItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingFee = cartItems.length > 0 ? 30000 : 0;
  const finalTotal = totalPrice + shippingFee;



  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Giỏ hàng</h1>
          <p className="mt-2 text-slate-500">
            Quản lý các sản phẩm bạn đã thêm vào giỏ
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <span>←</span>
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="mt-3 text-slate-500">
            Hãy thêm một vài mẫu kính thật đẹp vào giỏ hàng.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Xem sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-5">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${item.orderType}-${index}`}
                className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-start"
              >
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.color} · Size {item.size}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    Loại đơn: {getOrderTypeLabel(item.orderType)}
                  </p>

                  {item.orderType === "prescription" && item.prescription && (
                    <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">
                        Thông tin toa kính
                      </p>
                      <p className="mt-1">
                        SPH: trái {item.prescription.leftSPH} / phải {item.prescription.rightSPH}
                      </p>
                      <p className="mt-1">
                        CYL: trái {item.prescription.leftCYL} / phải {item.prescription.rightCYL}
                      </p>
                      <p className="mt-1">
                        AXIS: trái {item.prescription.leftAXIS} / phải {item.prescription.rightAXIS}
                      </p>
                      <p className="mt-1">PD: {item.prescription.pd}</p>
                      <p className="mt-1">Loại tròng: {item.prescription.lensType}</p>
                      {item.prescription.note && (
                        <p className="mt-1">Ghi chú: {item.prescription.note}</p>
                      )}
                    </div>
                  )}

                  <p className="mt-3 text-lg font-bold text-teal-600">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-11 w-fit items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, -1)}
                      className="px-4 text-lg transition hover:bg-slate-50"
                    >
                      -
                    </button>

                    <span className="px-4 text-sm font-medium">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(index, 1)}
                      className="px-4 text-lg transition hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="min-w-[120px] text-right">
                    <p className="text-base font-bold text-slate-900">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Tóm tắt đơn hàng
            </h2>

            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span className="font-medium text-slate-900">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-slate-900">
                  {shippingFee.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-bold text-teal-600">
                    {finalTotal.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>

          <button
  type="button"
  onClick={() => navigate("/checkout")}
  className="mt-6 w-full rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:opacity-90"
>
  Thanh toán
</button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Miễn phí đổi trả trong 7 ngày đối với sản phẩm lỗi.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;