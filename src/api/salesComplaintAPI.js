const SALES_COMPLAINT_API = "/api/v1/sales/complaints";

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
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getSalesComplaints(params = {}) {
  const res = await fetch(`${SALES_COMPLAINT_API}${toQueryString(params)}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc danh sach khieu nai.");
}

export async function createSalesComplaint(orderId, payload) {
  const res = await fetch(`${SALES_COMPLAINT_API}/${orderId}`, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong tao duoc khieu nai.");
}

export async function processSalesComplaint(complaintId, payload) {
  const res = await fetch(`${SALES_COMPLAINT_API}/${complaintId}/process`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong xu ly duoc khieu nai.");
}

export async function resolveSalesComplaint(complaintId, payload) {
  const res = await fetch(`${SALES_COMPLAINT_API}/${complaintId}/resolve`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong giai quyet duoc khieu nai.");
}
