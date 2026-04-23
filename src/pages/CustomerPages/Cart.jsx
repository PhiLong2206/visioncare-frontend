import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

const CART_API = "/api/Cart";

function getAccessToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function Cart() {
  const navigate = useNavigate();

  const { 
    cart, 
    cartItems, 
    totalPrice, 
    loading, 
    updateQuantity, 
    removeItem, 
    clearCartApi 
  } = useCart();

  const [isUpdating, setIsUpdating] = useState(false);

  const shippingFee = cartItems.length > 0 ? 30000 : 0;
  const finalTotal = totalPrice + shippingFee;

  const handleUpdateQuantity = async (item, newQuantity) => {
    try {
      setIsUpdating(true);
      await updateQuantity(item, newQuantity);
    } catch (error) {
      console.error("Update cart item failed:", error);
      toast.error(error.message || "Không cập nhật được số lượng.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (item) => {
    try {
      setIsUpdating(true);
      await removeItem(item);
      toast.success("Đã xoá sản phẩm khỏi giỏ hàng.");
    } catch (error) {
      console.error("Delete cart item failed:", error);
      toast.error(error.message || "Không xoá được sản phẩm.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!cartItems.length) {
      toast.error("Giỏ hàng đang trống.");
      return;
    }

    try {
      setIsUpdating(true);
      await clearCartApi();
      toast.success("Đã xoá toàn bộ giỏ hàng.");
    } catch (error) {
      console.error("Clear cart failed:", error);
      toast.error(error.message || "Không xoá được toàn bộ giỏ hàng.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Giỏ hàng</h1>
        <div className="mt-6 rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">Đang tải giỏ hàng...</p>
        </div>
      </section>
    );
  }

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
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
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
                    {item.isCombo
                      ? `${item.comboItems?.length || 2} sản phẩm trong combo`
                      : `${item.color} · Size ${item.size}`}
                  </p>

                  {!item.isCombo && (
                    <p className="mt-1 text-sm text-slate-500">SKU: {item.sku}</p>
                  )}

                  {!item.isCombo && (
                    <p className="mt-1 text-sm text-slate-500">
                      Tồn kho: {item.stockQuantity}
                    </p>
                  )}

                  {item.isCombo && (
                    <div className="mt-2 space-y-1 text-sm text-slate-500">
                      {item.comboItems.map((comboItem) => (
                        <p key={comboItem.cartItemId}>
                          {comboItem.name} · {comboItem.color} · Size{" "}
                          {comboItem.size}
                        </p>
                      ))}
                    </div>
                  )}

                  {item.prescriptionId && (
                    <p className="mt-1 text-sm font-medium text-blue-600">
                      Có toa kính (Prescription ID: {item.prescriptionId})
                    </p>
                  )}

                  {item.orderType === "pre-order" && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
                        Hàng đặt trước
                      </span>
                      <p className="text-xs font-medium text-amber-600 italic">
                        Cần đặt cọc 30% giá trị sản phẩm
                      </p>
                    </div>
                  )}

                  <p className="mt-3 text-lg font-bold text-teal-600">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>

                  {item.orderType === "pre-order" && (
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      Số tiền đặt cọc:{" "}
                      <span className="text-amber-600">
                        {item.depositAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {item.isCombo ? (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                      Số lượng: 1 combo
                    </div>
                  ) : (
                    <div className="flex h-11 w-fit items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity - 1)
                        }
                        disabled={isUpdating}
                        className="px-4 text-lg transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        -
                      </button>

                      <span className="px-4 text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item, item.quantity + 1)
                        }
                        disabled={
                          isUpdating || item.quantity >= item.stockQuantity
                        }
                        className="px-4 text-lg transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <div className="min-w-[120px] text-right">
                    <p className="text-base font-bold text-slate-900">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    disabled={isUpdating}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="mt-2 text-sm text-slate-500">
              Cart ID: {cart?.cartId} · Customer ID: {cart?.customerId}
            </div>

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

              {cartItems.some(item => item.orderType === "pre-order") && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-amber-600">
                  <span className="font-semibold">Tổng tiền cọc (30%)</span>
                  <span className="text-lg font-bold">
                    {cartItems.reduce((sum, item) => sum + (item.orderType === "pre-order" ? item.depositAmount * item.quantity : 0), 0).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">
                    {cartItems.some(item => item.orderType === "pre-order") ? "Tổng cộng thanh toán trước" : "Tổng cộng"}
                  </span>
                  <span className="text-xl font-bold text-teal-600">
                    {cartItems.some(item => item.orderType === "pre-order")
                      ? cartItems.reduce((sum, item) => sum + (item.orderType === "pre-order" ? item.depositAmount * item.quantity : 0), 0).toLocaleString("vi-VN")
                      : finalTotal.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              disabled={isUpdating}
              className="mt-6 w-full rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Thanh toán
            </button>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={isUpdating}
              className="mt-3 w-full rounded-2xl border border-red-200 px-6 py-3 font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Xóa toàn bộ giỏ hàng
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
