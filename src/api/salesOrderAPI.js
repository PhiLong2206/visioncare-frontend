const SALES_ORDER_API = "/api/v1/sales/orders";

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

function toQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getSalesOrders(params = {}) {
  const res = await fetch(`${SALES_ORDER_API}${toQueryString(params)}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc danh sach don hang.");
}

export async function getPendingSalesOrders(params = {}) {
  const res = await fetch(`${SALES_ORDER_API}/pending${toQueryString(params)}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc don hang cho xac nhan.");
}

export async function getSalesOrderDetail(id) {
  const res = await fetch(`${SALES_ORDER_API}/${id}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc chi tiet don hang.");
}

export async function markOrderPaid(id, payload) {
  const res = await fetch(`${SALES_ORDER_API}/${id}/payment`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong xac nhan duoc thanh toan.");
}

export async function confirmSalesOrder(id, payload) {
  const res = await fetch(`${SALES_ORDER_API}/${id}/confirm`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong xac nhan duoc don hang.");
}

export async function rejectSalesOrder(id, payload) {
  const res = await fetch(`${SALES_ORDER_API}/${id}/reject`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong tu choi duoc don hang.");
}

export async function assignSalesOrder(id, payload) {
  const res = await fetch(`${SALES_ORDER_API}/${id}/assign`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong giao duoc don cho Operations.");
}

export async function addSalesOrderStaffNote(id, payload) {
  const res = await fetch(`${SALES_ORDER_API}/${id}/staff-note`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong them duoc ghi chu nhan vien.");
}
