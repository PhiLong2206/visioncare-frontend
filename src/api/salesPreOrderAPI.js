const SALES_PRE_ORDER_API = "/api/v1/sales/pre-orders";

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

// --- Reservation Pipeline (New Workflow) ---

export async function getReservations(statusFilter) {
    const query = statusFilter ? `?statusFilter=${statusFilter}` : '';
    const res = await fetch(`${SALES_PRE_ORDER_API}${query}`, {
        method: "GET",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Không tải được danh sách đặt chỗ.");
}

export async function confirmFirstCall(id) {
    const res = await fetch(`${SALES_PRE_ORDER_API}/${id}/confirm`, {
        method: "POST",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Không thực hiện được xác nhận cuộc gọi 1.");
}

export async function sendToOps(id) {
    const res = await fetch(`${SALES_PRE_ORDER_API}/${id}/send-to-ops`, {
        method: "POST",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Không chuyển được sang Ops.");
}

export async function notifyStockReady(id) {
    const res = await fetch(`${SALES_PRE_ORDER_API}/${id}/notify-stock`, {
        method: "POST",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Không thực hiện được xác nhận báo có hàng.");
}

export async function releaseToShipping(id) {
    const res = await fetch(`${SALES_PRE_ORDER_API}/${id}/release`, {
        method: "POST",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Không giải phóng được đơn hàng.");
}

export async function getReservationDetail(id) {
    const res = await fetch(`${SALES_PRE_ORDER_API}/${id}`, {
        method: "GET",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Không tải được chi tiết đặt chỗ.");
}

// --- Archive (Old Campaign Methods - Moved to managerPreOrderAPI.js) ---
/*
export async function getPreOrderCampaigns(...) 
export async function createPreOrderCampaign(...)
...
*/
