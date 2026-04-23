export type OrderType = "ORDER" | "PRE-ORDER";
export type OrderStatus =
  | "SENT TO LAB"
  | "AWAITING VERIFICATION"
  | "PROCESSING"
  | "CANCELLED";
export type PrescriptionStatus =
  | "Verified"
  | "Manual Check Required"
  | "No Rx Attached";

export interface Order {
  id: string;
  orderCode?: string;
  customer: string;
  email: string;
  date: string;
  orderType: OrderType;
  prescription: PrescriptionStatus;
  status: OrderStatus;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress?: string;
  staffNote?: string;
  items?: any[];
}

export const ORDERS_PER_PAGE = 5;

export const ORDER_TYPE_STYLES: Record<OrderType, string> = {
  ORDER: "bg-blue-100 text-blue-700",
  "PRE-ORDER": "bg-purple-100 text-purple-700",
};

export const STATUS_STYLES: Record<OrderStatus, string> = {
  "SENT TO LAB": "bg-teal-100 text-teal-700",
  "AWAITING VERIFICATION": "bg-orange-100 text-orange-700",
  PROCESSING: "bg-gray-200 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export const TYPEITEMS = [
  {
    name: "Đã xác nhận",
    id: "SENT TO LAB",
  },
  {
    name: "Đợi kiểm tra",
    id: "AWAITING VERIFICATION",
  },
  {
    name: "Đang tiến hành",
    id: "PROCESSING",
  },
  {
    name: "Đã hủy",
    id: "CANCELLED",
  },
] as const;

const ORDER_API = "/api/v1/sales/orders";

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function normalizeOrderType(value: unknown): OrderType {
  const text = String(value ?? "")
    .trim()
    .toUpperCase();

  if (
    text === "PRE-ORDER" ||
    text === "PREORDER" ||
    text === "PRE_ORDER" ||
    text === "PRE ORDER"
  ) {
    return "PRE-ORDER";
  }

  return "ORDER";
}

function normalizeOrderStatus(value: unknown): OrderStatus {
  const text = String(value ?? "")
    .trim()
    .toUpperCase();

  if (text === "SENT TO LAB" || text === "SENT_TO_LAB" || text === "CONFIRMED") {
    return "SENT TO LAB";
  }

  if (
    text === "AWAITING VERIFICATION" ||
    text === "AWAITING_VERIFICATION" ||
    text === "PENDING"
  ) {
    return "AWAITING VERIFICATION";
  }

  if (text === "CANCELLED" || text === "CANCELED") {
    return "CANCELLED";
  }

  return "PROCESSING";
}

function normalizePrescriptionStatus(hasRx?: boolean, isVerified?: boolean): PrescriptionStatus {
  if (hasRx === false || hasRx === undefined) return "No Rx Attached";
  if (isVerified) return "Verified";
  return "Manual Check Required";
}

function formatDate(value: unknown): string {
  if (!value) return "";

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function mapOrderFromApi(item: any): Order {
  const rawItems = item?.items || [];
  const hasPrescription =
    item?.hasPrescription ??
    rawItems.some((orderItem: any) => Boolean(orderItem?.prescriptionId));
  const isPrescriptionVerified =
    item?.isPrescriptionVerified ??
    rawItems
      .filter((orderItem: any) => Boolean(orderItem?.prescriptionId))
      .every((orderItem: any) => Boolean(orderItem?.isPrescriptionVerified));

  return {
    id: String(
      item?.orderId ??
      item?.id ??
      ""
    ),
    orderCode: String(
      item?.orderCode ??
      item?.code ??
      ""
    ),
    customer: String(
      item?.customerName ??
      item?.fullName ??
      item?.customer?.fullName ??
      item?.customer?.name ??
      item?.user?.fullName ??
      item?.user?.name ??
      "Unknown Customer"
    ),
    email: String(
      item?.email ??
      item?.customerEmail ??
      item?.customer?.email ??
      item?.user?.email ??
      ""
    ),
    date: formatDate(
      item?.createdAt ??
      item?.orderDate ??
      item?.createdDate ??
      item?.date
    ),
    orderType: normalizeOrderType(
      item?.orderType ?? item?.type ?? item?.isPreOrder
    ),
    prescription: normalizePrescriptionStatus(
      hasPrescription,
      isPrescriptionVerified
    ),
    status: normalizeOrderStatus(item?.status ?? item?.orderStatus),
    paymentStatus: String(item?.paymentStatus ?? "Unpaid"),
    totalAmount: Number(item?.totalAmount ?? 0),
    shippingAddress: item?.shippingAddress,
    staffNote: item?.staffNote,
    items: rawItems.map((i: any) => ({
      orderItemId: i.orderItemId,
      variantId: i.variantId,
      productName: i.productName,
      variantInfo: i.variantInfo,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      subtotal: i.subtotal,
      prescriptionId: i.prescriptionId,
      odSphere: i.odSphere,
      odCylinder: i.odCylinder,
      odAxis: i.odAxis,
      osSphere: i.osSphere,
      osCylinder: i.osCylinder,
      osAxis: i.osAxis,
      pd: i.pd,
      prescriptionNote: i.prescriptionNote,
      isPrescriptionVerified: i.isPrescriptionVerified,
    })),
  };
}

export const getStaffOrderDetail = async (id: string | number): Promise<Order> => {
  const token = getAccessToken();

  const res = await fetch(`${ORDER_API}/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Lấy chi tiết đơn hàng thất bại (${res.status})`);
  }

  const data = await res.json();
  return mapOrderFromApi(data?.Data ?? data);
};

export const confirmOrder = async (id: string | number, note?: string) => {
  const token = getAccessToken();

  const res = await fetch(`${ORDER_API}/${id}/confirm`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ note }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Xác nhận đơn hàng thất bại.");
  }

  return res.json();
};

export const markOrderPaid = async (
  id: string | number,
  paymentData: {
    paymentMethod: string;
    amountPaid?: number;
    transactionRef?: string;
    note?: string;
  }
) => {
  const token = getAccessToken();

  const res = await fetch(`${ORDER_API}/${id}/payment`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(paymentData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Xác nhận thanh toán thất bại.");
  }

  return res.json();
};

export const assignOrderToOps = async (id: string | number, note?: string) => {
  const token = getAccessToken();

  const res = await fetch(`${ORDER_API}/${id}/assign`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ note }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Giao đơn cho kĩ thuật thất bại.");
  }

  return res.json();
};

export const getAllOrders = async (): Promise<Order[]> => {
  const token = getAccessToken();

  const res = await fetch(ORDER_API, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const responseData = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (res.status === 401) {
    throw new Error("Phiên đăng nhập đã hết hạn.");
  }

  if (!res.ok) {
    const message =
      responseData?.message ||
      responseData?.title ||
      (typeof responseData === "string" ? responseData : null) ||
      `Lấy danh sách đơn hàng thất bại (${res.status})`;

    throw new Error(message);
  }

  const rawOrders = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData?.Data)
        ? responseData.Data
        : Array.isArray(responseData?.items)
          ? responseData.items
          : [];

  return rawOrders.map(mapOrderFromApi);
};

export const transStatus = (order: Order) => {
  if (order.status === "SENT TO LAB") return "Đã xác nhận";
  if (order.status === "AWAITING VERIFICATION") return "Đợi kiểm tra";
  if (order.status === "PROCESSING") return "Đang tiến hành";
  if (order.status === "CANCELLED") return "Đã hủy";
  return "Không xác định";
};
