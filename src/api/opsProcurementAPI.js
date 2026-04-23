const OPS_PROCUREMENT_API = "/api/v1/ops/procurement";

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

export async function getReceipts(status = "") {
  const query = status ? `?status=${status}` : "";
  const res = await fetch(`${OPS_PROCUREMENT_API}/receipts${query}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Không tải được danh sách phiếu nhập.");
}

export async function getReceiptDetail(id) {
  const res = await fetch(`${OPS_PROCUREMENT_API}/receipts/${id}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Không tải được chi tiết phiếu nhập.");
}

export async function createPurchaseRequest(payload) {
  const res = await fetch(`${OPS_PROCUREMENT_API}/request`, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Không tạo được yêu cầu nhập hàng.");
}

export async function approvePurchaseRequest(id) {
  const res = await fetch(`${OPS_PROCUREMENT_API}/receipts/${id}/approve`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Không duyệt được yêu cầu nhập hàng.");
}

export async function submitEvidence(id, payload) {
  const res = await fetch(`${OPS_PROCUREMENT_API}/receipts/${id}/evidence`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Không tải được bằng chứng nhập hàng.");
}

export async function finalConfirmReceipt(id) {
  const res = await fetch(`${OPS_PROCUREMENT_API}/receipts/${id}/confirm`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Không xác nhận nhập kho được.");
}
