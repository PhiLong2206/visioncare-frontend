const ORDERS_API = "/api/Orders";

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function buildAuthHeaders(extraHeaders = {}) {
  const token = getAccessToken();

  return {
    accept: "*/*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function parseApiResponse(res, fallbackMessage) {
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(data?.message || data?.title || fallbackMessage);
  }

  return data;
}

export async function createOrder(payload) {
  const res = await fetch(ORDERS_API, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Dat hang that bai.");
}

export async function getCustomerOrders() {
  const res = await fetch(ORDERS_API, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong the tai don hang.");
}

export async function getCustomerOrderDetail(id) {
  const res = await fetch(`${ORDERS_API}/${id}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong the tai chi tiet don hang.");
}

export async function cancelCustomerOrder(id) {
  const res = await fetch(`${ORDERS_API}/${id}/cancel`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong huy duoc don hang.");
}

export async function completeCustomerOrder(id) {
  const res = await fetch(`${ORDERS_API}/${id}/complete`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong xac nhan duoc don hang.");
}

export async function createCustomerOrderPaymentLink(id) {
  const res = await fetch(`${ORDERS_API}/${id}/create-payment-link`, {
    method: "POST",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tao duoc link thanh toan.");
}

export async function checkCustomerOrderPaymentStatus(id, paymentLinkId) {
  const res = await fetch(`${ORDERS_API}/${id}/payment-status/${paymentLinkId}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong kiem tra duoc trang thai thanh toan.");
}
