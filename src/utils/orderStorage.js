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
    case "vnpay":
      return "VNPay";
    case "sepay":
      return "Sepay";
    case "payos":
      return "PayOS";
    default:
      return "Chưa xác định";
  }
}

function detectOrderFlow(cartItems) {
  const hasPreOrder = cartItems.some((item) => item.orderType === "pre-order");
  const hasPrescription = cartItems.some(
    (item) => item.orderType === "prescription"
  );

  if (hasPreOrder) return "pre-order";
  if (hasPrescription) return "prescription";
  return "normal";
}

function getInitialStatusByFlow(flowType) {
  switch (flowType) {
    case "pre-order":
      return "Chờ xác nhận";
    case "prescription":
      return "Chờ xác nhận";
    case "normal":
    default:
      return "Chờ xác nhận";
  }
}

function getOrderTags(cartItems) {
  const tags = [];

  if (cartItems.some((item) => item.orderType === "pre-order")) {
    tags.push("pre-order");
  }

  if (cartItems.some((item) => item.orderType === "prescription")) {
    tags.push("prescription");
  }

  if (cartItems.some((item) => item.orderType === "in-stock")) {
    tags.push("in-stock");
  }

  return tags;
}

export function createNewOrder(cartItems, totalPrice, formData) {
  const existingOrders = getStoredOrders();

  const flowType = detectOrderFlow(cartItems);
  const initialStatus = getInitialStatusByFlow(flowType);

  const newOrder = {
    id: generateOrderId(existingOrders),
    date: new Date().toISOString().split("T")[0],

    status: initialStatus,
    flowType,
    tags: getOrderTags(cartItems),

    shippingUnit: "",
    trackingCode: "",

    customerName: formData.fullName || "",
    phone: formData.phone || "",
    email: formData.email || "",
    address: formData.address || "",
    paymentMethod: getPaymentMethodLabel(formData.paymentMethod),
    paymentMethodCode: formData.paymentMethod || "",

    total: totalPrice,

    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      color: item.color,
      size: item.size,
      category: item.category || "",
      frameType: item.frameType || "",
      orderType: item.orderType || "in-stock",
      prescription: item.prescription || null,
    })),
  };

  const updatedOrders = [newOrder, ...existingOrders];
  saveOrders(updatedOrders);

  return newOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const orders = getStoredOrders();

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: newStatus,
        }
      : order
  );

  saveOrders(updatedOrders);
  return updatedOrders;
}

export function updateOrderShipping(orderId, shippingData) {
  const orders = getStoredOrders();

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          shippingUnit: shippingData.shippingUnit ?? order.shippingUnit,
          trackingCode: shippingData.trackingCode ?? order.trackingCode,
        }
      : order
  );

  saveOrders(updatedOrders);
  return updatedOrders;
}

export function updateOrderById(orderId, patchData) {
  const orders = getStoredOrders();

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          ...patchData,
        }
      : order
  );

  saveOrders(updatedOrders);
  return updatedOrders;
}