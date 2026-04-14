import { orders as defaultOrders } from "../data/orders";

const ORDERS_KEY = "visioncare_orders";

export function getStoredOrders() {
  const raw = localStorage.getItem(ORDERS_KEY);

  if (!raw) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
    return defaultOrders;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
    return defaultOrders;
  }
}

export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function generateOrderId(existingOrders) {
  const prefix = "VC-2024-";
  const nextNumber = existingOrders.length + 1;
  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}

function getPaymentMethodLabel(paymentMethod) {
  switch (paymentMethod) {
    case "cod":
      return "Thanh toán khi nhận hàng";
    case "bank":
      return "Chuyển khoản ngân hàng";
    case "card":
      return "Thẻ tín dụng / Ghi nợ";
    default:
      return "Chưa xác định";
  }
}

export function createNewOrder(cartItems, totalPrice, formData) {
  const existingOrders = getStoredOrders();

  const shippingFee = totalPrice >= 2000000 ? 0 : 30000;

  const newOrder = {
    id: generateOrderId(existingOrders),
    date: new Date().toISOString().split("T")[0],
    status: "Chờ xác nhận",
    shippingUnit: "GHN",
    trackingCode: `GHN${Date.now()}`,

    customerName: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
    paymentMethod: getPaymentMethodLabel(formData.paymentMethod),

    total: totalPrice + shippingFee,

    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      color: item.color,
      size: item.size,
      orderType: item.orderType || "in-stock",
      prescription: item.prescription || null,
    })),
  };

  const updatedOrders = [newOrder, ...existingOrders];
  saveOrders(updatedOrders);

  return newOrder;
}