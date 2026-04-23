const OPS_SHIPPING_API = "/api/v1/ops/shipping";

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

export async function getShippingMethods() {
  const res = await fetch(`${OPS_SHIPPING_API}/methods`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc phuong thuc van chuyen.");
}

export async function createShippingOrder(orderId, payload) {
  const res = await fetch(`${OPS_SHIPPING_API}/orders/${orderId}/shipping`, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong tao duoc don van chuyen.");
}

export async function markAsShipped(orderId) {
  const res = await fetch(`${OPS_SHIPPING_API}/orders/${orderId}/ship`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong danh dau duoc don da giao cho van chuyen.");
}

export async function getShippingStatuses() {
  const res = await fetch(`${OPS_SHIPPING_API}/statuses`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc trang thai van chuyen.");
}

export async function updateShippingStatus(orderId, payload) {
  const res = await fetch(`${OPS_SHIPPING_API}/orders/${orderId}/status`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong cap nhat duoc trang thai van chuyen.");
}

export async function getShippingHistory(orderId) {
  const res = await fetch(`${OPS_SHIPPING_API}/orders/${orderId}/history`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc lich su van chuyen.");
}

export async function trackShipping(trackingNo) {
  const res = await fetch(
    `${OPS_SHIPPING_API}/tracking/${encodeURIComponent(trackingNo)}`,
    {
      method: "GET",
      headers: buildAuthHeaders(),
    }
  );

  return parseApiResponse(res, "Khong theo doi duoc van don.");
}

export async function markAsDelivered(orderId) {
  const res = await fetch(`${OPS_SHIPPING_API}/orders/${orderId}/delivered`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong danh dau duoc don da giao thanh cong.");
}
