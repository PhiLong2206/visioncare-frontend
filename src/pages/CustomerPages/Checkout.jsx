import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { createPreOrderDepositLink } from "../../api/customerPreOrderAPI";
import { createOrder, createCustomerOrderPaymentLink } from "../../api/ordersAPI";
import { getShippingSettings } from "../../api/systemSettingsAPI";
import { useEffect } from "react";

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

function getOrderTypeClass(orderType) {
  switch (orderType) {
    case "pre-order":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "prescription":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "in-stock":
      return "bg-green-50 text-green-700 border border-green-200";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200";
  }
}

function getAccessToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function getFriendlyCheckoutError(message) {
  if (!message) return "Không thể tạo đơn hàng.";

  if (
    message.includes("An error occurred while saving the entity changes") ||
    message.includes("Invalid column name")
  ) {
    return "Backend đang lỗi dữ liệu đơn hàng, chưa thể tạo đơn lúc này.";
  }

  return message;
}

function findReservationId(data) {
  if (!data || typeof data !== "object") return null;

  const directId =
    data.reservationId ||
    data.preOrderReservationId ||
    data.preorderReservationId;

  if (directId) return directId;
  if (data.reservation?.reservationId) return data.reservation.reservationId;

  if (
    Array.isArray(data.preOrderReservationIds) &&
    data.preOrderReservationIds[0]
  ) {
    return data.preOrderReservationIds[0];
  }

  if (
    Array.isArray(data.PreOrderReservationIds) &&
    data.PreOrderReservationIds[0]
  ) {
    return data.PreOrderReservationIds[0];
  }

  const reservations = data.reservations || data.preOrderReservations;
  if (Array.isArray(reservations) && reservations[0]?.reservationId) {
    return reservations[0].reservationId;
  }

  return null;
}

function savePendingPreOrderPayment(reservationId, paymentLinkId) {
  if (!reservationId || !paymentLinkId) return;

  localStorage.setItem(
    "pendingPreOrderPayment",
    JSON.stringify({
      reservationId,
      paymentLinkId,
      createdAt: new Date().toISOString(),
    })
  );
}

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
    paymentMethod: "bank",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingConfig, setShippingConfig] = useState({
    innerCityFee: 30000,
    outerCityFee: 35000,
    freeThreshold: 2000000,
  });

  useEffect(() => {
    const fetchSettings = async () => {
        const settings = await getShippingSettings();
        setShippingConfig(settings);
    };
    fetchSettings();
  }, []);

  const hasPreOrder = cartItems.some((item) => item.orderType === "pre-order");
  const hasPrescription = cartItems.some(
    (item) => item.orderType === "prescription"
  );

  const depositTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.depositAmount * item.quantity), 0);
  }, [cartItems]);

  const shippingFee = useMemo(() => {
    if (hasPreOrder) return 0;
    if (totalPrice >= shippingConfig.freeThreshold) return 0;
    
    // Simple logic: if city is HCM or Hanoi, use innerCityFee, else outer
    const isInnerCity = ["TP.HCM", "Hà Nội", "Hồ Chí Minh"].some(c => 
        formData.city.includes(c)
    );
    
    return cartItems.length > 0 
        ? (isInnerCity ? shippingConfig.innerCityFee : shippingConfig.outerCityFee) 
        : 0;
  }, [totalPrice, cartItems.length, hasPreOrder, formData.city, shippingConfig]);

  const finalTotal = hasPreOrder ? depositTotal : totalPrice + shippingFee;

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

  const buildOrderType = () => {
    if (hasPrescription) return "Prescription";
    if (hasPreOrder) return "Pre-order";
    return "Ready-made";
  };

  const buildShippingAddress = () => {
    return `${formData.fullName} - ${formData.phone} - ${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const token = getAccessToken();
    if (!token) {
      toast.error("Bạn cần đăng nhập trước khi đặt hàng.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        shippingAddress: buildShippingAddress(),
        orderType: buildOrderType(),
        shippingFee: shippingFee,
      };

      console.log("CHECKOUT PAYLOAD:", payload);

      const responseData = await createOrder(payload);

      console.log("CHECKOUT RESPONSE:", responseData);

      if (hasPreOrder) {
        const reservationId = findReservationId(responseData);

        if (reservationId) {
          const depositLink = await createPreOrderDepositLink(reservationId);
          savePendingPreOrderPayment(reservationId, depositLink?.paymentLinkId);

          if (depositLink?.checkoutUrl) {
            clearCart();
            navigate("/payment-simulation", {
              state: {
                reservationId,
                checkoutUrl: depositLink.checkoutUrl,
                amount: finalTotal,
                orderType: "Pre-order",
              },
            });
            return;
          }
        }

        toast(
          "Đơn pre-order đã tạo, nhưng response chưa có reservationId để tạo link đặt cọc.",
          { icon: "!" }
        );
      } else {
        // For normal orders (Ready-made, Prescription, Combo, Frame-only)
        const orderId = responseData.orderId;
        
        try {
          toast.loading("Đang khởi tạo thanh toán...", { id: "checkout-payment" });
          const paymentLink = await createCustomerOrderPaymentLink(orderId);
          toast.dismiss("checkout-payment");

          if (paymentLink?.checkoutUrl) {
            clearCart();
            navigate("/payment-simulation", {
              state: {
                orderId,
                checkoutUrl: paymentLink.checkoutUrl,
                amount: finalTotal,
                orderType: buildOrderType(),
                paymentLinkId: paymentLink.paymentLinkId
              },
            });
            return;
          }
        } catch (paymentError) {
          toast.dismiss("checkout-payment");
          console.error("Create payment link failed:", paymentError);
          // Fallback if link creation fails but order was created
          clearCart();
          toast.success("Đặt hàng thành công! Vui lòng thanh toán trong chi tiết đơn hàng.");
          navigate("/orders");
          return;
        }
      }

      clearCart();
      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (error) {
      console.error("Create order failed:", error);
      toast.error(
        getFriendlyCheckoutError(error.message || "Không thể tạo đơn hàng.")
      );
    } finally {
      setIsSubmitting(false);
    }
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
                placeholder="Số nhà, đường"
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
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-teal-500 bg-teal-50 px-4 py-4 transition shadow-sm">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={true}
                  readOnly
                  className="accent-teal-600"
                />
                <div className="flex-1">
                    <p className="font-bold text-slate-900">Chuyển khoản ngân hàng (PayOS)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Hỗ trợ quét mã QR ngân hàng và Giả lập thanh toán</p>
                </div>
              </label>
              
              <p className="text-[11px] text-slate-400 italic px-2">
                * Hiện tại hệ thống chỉ hỗ trợ thanh toán qua ngân hàng để đảm bảo an toàn giao dịch.
              </p>
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
                key={`${item.cartItemId}-${item.size}-${item.orderType}-${index}`}
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
                  <p className="text-sm text-slate-500">
                    {item.isCombo ? "x1 combo" : `x${item.quantity}`}
                  </p>
                  {item.isCombo && (
                    <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                      {item.comboItems.map((comboItem) => (
                        <p key={comboItem.cartItemId}>{comboItem.name}</p>
                      ))}
                    </div>
                  )}

                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getOrderTypeClass(
                      item.orderType
                    )}`}
                  >
                    {getOrderTypeLabel(item.orderType)}
                  </span>
                </div>

                <p className="font-medium text-slate-900">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </p>
              </div>
            ))}
          </div>

          {hasPreOrder && (
            <p className="mt-4 text-sm font-medium text-amber-600">
              Có sản phẩm đặt trước, thời gian giao hàng có thể lâu hơn.
            </p>
          )}

          {hasPrescription && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              Đơn hàng có sản phẩm cần gia công theo toa kính.
            </p>
          )}

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
                {hasPreOrder 
                  ? "Miễn phí (Giai đoạn cọc)" 
                  : shippingFee === 0
                    ? "Miễn phí"
                    : `${shippingFee.toLocaleString("vi-VN")} đ`}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-2xl font-bold text-slate-900">
              {hasPreOrder ? "Tổng tiền cọc (30%)" : "Tổng cộng"}
            </span>
            <span className={`text-3xl font-bold ${hasPreOrder ? "text-amber-600" : "text-teal-600"}`}>
              {finalTotal.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Đang xử lý..." : hasPreOrder ? "Thanh toán tiền cọc" : "Xác nhận đặt hàng"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
