const MANAGER_PRE_ORDER_API = "/api/v1/manager/pre-orders";

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

// Campaign Management
export async function getManagerCampaigns(status) {
    const query = status ? `?status=${status}` : '';
    const res = await fetch(`${MANAGER_PRE_ORDER_API}/campaigns${query}`, {
        headers: buildAuthHeaders()
    });
    return parseApiResponse(res, "Không tải được danh sách chiến dịch.");
}

export async function createManagerCampaign(payload) {
    const res = await fetch(`${MANAGER_PRE_ORDER_API}/campaigns`, {
        method: "POST",
        headers: buildAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload)
    });
    return parseApiResponse(res, "Không tạo được chiến dịch.");
}

export async function updateManagerCampaign(id, payload) {
    const res = await fetch(`${MANAGER_PRE_ORDER_API}/campaigns/${id}`, {
        method: "PUT",
        headers: buildAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload)
    });
    return parseApiResponse(res, "Không cập nhật được chiến dịch.");
}

export async function getManagerCampaignDetail(id) {
    const res = await fetch(`${MANAGER_PRE_ORDER_API}/campaigns/${id}`, {
        headers: buildAuthHeaders()
    });
    return parseApiResponse(res, "Không tải được chi tiết chiến dịch.");
}

// Receipts & Conversion
export async function createGoodsReceipt(payload) {
  const res = await fetch(`${MANAGER_PRE_ORDER_API}/receipts`, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong tao duoc phieu nhap hang.");
}

export async function completeGoodsReceipt(id, payload) {
  const res = await fetch(`${MANAGER_PRE_ORDER_API}/receipts/${id}/complete`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong hoan thanh duoc phieu nhap hang.");
}

export async function convertPreOrders(campaignId, payload) {
  const res = await fetch(`${MANAGER_PRE_ORDER_API}/${campaignId}/convert-orders`, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong convert duoc pre-order sang order.");
}

export async function updateDepositConfig(campaignId, payload) {
  const res = await fetch(`${MANAGER_PRE_ORDER_API}/${campaignId}/deposit-config`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong cap nhat duoc cau hinh dat coc.");
}
