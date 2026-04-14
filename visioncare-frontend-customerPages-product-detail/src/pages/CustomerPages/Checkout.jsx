import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { createNewOrder } from "../../utils/orderStorage";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "email@example.com",
    address: "",
    city: "TP.HCM",
    district: "Quận 1",
    ward: "Bến Nghé",
    paymentMethod: "cod",
  });

  const shippingFee = useMemo(() => {
    if (totalPrice >= 2000000) return 0;
    return cartItems.length > 0 ? 30000 : 0;
  }, [totalPrice, cartItems.length]);

  const finalTotal = totalPrice + shippingFee;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!cartItems.length) {
      toast.error("Giỏ hàng đang trống.");
      return false;
    }

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.district.trim() ||
      !formData.ward.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin nhận hàng.");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    createNewOrder(cartItems, totalPrice);
    clearCart();

    toast.success("Đặt hàng thành công!");
    navigate("/orders");
  };

  if (!cartItems.length) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Thanh toán</h1>
        <div className="mt-6 rounded-3xl bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="mt-3 text-slate-500">
            Hãy thêm sản phẩm trước khi thanh toán.
          </p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Xem sản phẩm
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Thanh toán</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.8fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Thông tin nhận hàng
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="0901234567"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Số nhà, đường, phường/xã"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Tỉnh/Thành phố
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Quận/Huyện
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Phường/Xã
                </label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Phương thức thanh toán
            </h2>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-slate-300">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={(e) =>
                    handleChange("paymentMethod", e.target.value)
                  }
                />
                <span className="text-slate-900">
                  Thanh toán khi nhận hàng (COD)
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-slate-300">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === "bank"}
                  onChange={(e) =>
                    handleChange("paymentMethod", e.target.value)
                  }
                />
                <span className="text-slate-900">Chuyển khoản ngân hàng</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-slate-300">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={(e) =>
                    handleChange("paymentMethod", e.target.value)
                  }
                />
                <span className="text-slate-900">Thẻ tín dụng / Ghi nợ</span>
              </label>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Đơn hàng ({cartItems.length} sản phẩm)
          </h2>

          <div className="mt-6 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${item.orderType}-${index}`}
                className="flex items-start gap-4"
              >
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">x{item.quantity}</p>
                </div>

                <p className="font-medium text-slate-900">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Tạm tính</span>
              <span className="font-medium text-slate-900">
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Vận chuyển</span>
              <span className="font-medium text-slate-900">
                {shippingFee === 0
                  ? "Miễn phí"
                  : `${shippingFee.toLocaleString("vi-VN")} đ`}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-2xl font-bold text-slate-900">Tổng cộng</span>
            <span className="text-3xl font-bold text-teal-600">
              {finalTotal.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;