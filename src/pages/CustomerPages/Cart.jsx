import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const mapCartItems = (items = []) => {
    return items.map((item) => ({
      cartItemId: item.cartItemId,
      variantId: item.variantId,
      name: item.productName,
      color: item.variantColor,
      size: item.variantSize,
      sku: item.sku,
      quantity: Number(item.quantity || 0),
      price: Number(item.unitPrice || 0),
      stockQuantity: Number(item.stockQuantity || 0),
      prescriptionId: item.prescriptionId,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
      orderType: item.prescriptionId ? "prescription" : "in-stock",
    }));
  };

  const fetchCart = async () => {
    const token = getAccessToken();

    if (!token) {
      toast.error("Bạn cần đăng nhập để xem giỏ hàng.");
      setCart(null);
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(CART_API, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      console.log("CART API:", data);

      setCart(data || null);
      setCartItems(mapCartItems(data?.items || []));
    } catch (error) {
      console.error("Fetch cart failed:", error);
      toast.error("Không tải được giỏ hàng.");
      setCart(null);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = useMemo(() => {
    if (cart?.totalAmount !== undefined && cart?.totalAmount !== null) {
      return Number(cart.totalAmount);
    }

    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart, cartItems]);

  const shippingFee = cartItems.length > 0 ? 30000 : 0;
  const finalTotal = totalPrice + shippingFee;

  const handleUpdateQuantity = async (item, newQuantity) => {
    const token = getAccessToken();

    if (!token) {
      toast.error("Bạn cần đăng nhập.");
      return;
    }

    if (newQuantity < 1) {
      await handleRemove(item);
      return;
    }

    if (newQuantity > item.stockQuantity) {
      toast.error("Số lượng vượt quá tồn kho.");
      return;
    }

    try {
      setIsUpdating(true);

      const res = await fetch(`/api/Cart/items/${item.cartItemId}`, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Không cập nhật được số lượng.";
        try {
          const errorData = await res.json();
          errorMessage =
            errorData?.message || errorData?.title || errorMessage;
        } catch {
          // ignore parse error
        }
        throw new Error(errorMessage);
      }

      await fetchCart();
    } catch (error) {
      console.error("Update cart item failed:", error);
      toast.error(error.message || "Không cập nhật được số lượng.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (item) => {
    const token = getAccessToken();

    if (!token) {
      toast.error("Bạn cần đăng nhập.");
      return;
    }

    try {
      setIsUpdating(true);

      const res = await fetch(`/api/Cart/items/${item.cartItemId}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errorMessage = "Không xoá được sản phẩm.";
        try {
          const errorData = await res.json();
          errorMessage =
            errorData?.message || errorData?.title || errorMessage;
        } catch {
          // ignore parse error
        }
        throw new Error(errorMessage);
      }

      toast.success("Đã xoá sản phẩm khỏi giỏ hàng.");
      await fetchCart();
    } catch (error) {
      console.error("Delete cart item failed:", error);
      toast.error(error.message || "Không xoá được sản phẩm.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    const token = getAccessToken();

    if (!token) {
      toast.error("Bạn cần đăng nhập.");
      return;
    }

    if (!cartItems.length) {
      toast.error("Giỏ hàng đang trống.");
      return;
    }

    try {
      setIsUpdating(true);

      const res = await fetch(CART_API, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errorMessage = "Không xoá được toàn bộ giỏ hàng.";
        try {
          const errorData = await res.json();
          errorMessage =
            errorData?.message || errorData?.title || errorMessage;
        } catch {
          // ignore parse error
        }
        throw new Error(errorMessage);
      }

      toast.success("Đã xoá toàn bộ giỏ hàng.");
      await fetchCart();
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
                    {item.color} · Size {item.size}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">SKU: {item.sku}</p>

                  <p className="mt-1 text-sm text-slate-500">
                    Tồn kho: {item.stockQuantity}
                  </p>

                  {item.prescriptionId && (
                    <p className="mt-1 text-sm font-medium text-blue-600">
                      Có toa kính (Prescription ID: {item.prescriptionId})
                    </p>
                  )}

                  <p className="mt-3 text-lg font-bold text-teal-600">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                      disabled={isUpdating || item.quantity >= item.stockQuantity}
                      className="px-4 text-lg transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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