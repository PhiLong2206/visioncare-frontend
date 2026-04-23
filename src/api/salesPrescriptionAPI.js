const SALES_PRESCRIPTION_API = "/api/v1/sales";

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

export async function getSalesPrescriptionOrders(params = {}) {
  const res = await fetch(
    `${SALES_PRESCRIPTION_API}/orders/prescription${toQueryString(params)}`,
    {
      method: "GET",
      headers: buildAuthHeaders(),
    }
  );

  return parseApiResponse(res, "Khong tai duoc danh sach don ke don.");
}

export async function getPrescriptionReview(orderId) {
  const res = await fetch(
    `${SALES_PRESCRIPTION_API}/orders/${orderId}/prescription-review`,
    {
      method: "GET",
      headers: buildAuthHeaders(),
    }
  );

  return parseApiResponse(res, "Khong tai duoc chi tiet toa kinh.");
}

export async function verifyPrescription(orderId, payload) {
  const res = await fetch(
    `${SALES_PRESCRIPTION_API}/orders/${orderId}/verify-prescription`,
    {
      method: "PUT",
      headers: buildAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse(res, "Khong xac minh duoc toa kinh.");
}

export async function adjustPrescription(orderId, payload) {
  const res = await fetch(
    `${SALES_PRESCRIPTION_API}/orders/${orderId}/prescription/adjust`,
    {
      method: "PUT",
      headers: buildAuthHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse(res, "Khong gui duoc yeu cau dieu chinh toa kinh.");
}
