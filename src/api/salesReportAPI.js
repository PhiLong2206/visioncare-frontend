const SALES_REPORT_API = "/api/v1";

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function buildAuthHeaders() {
  const token = getAccessToken();

  return {
    accept: "*/*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function getSalesSummary(params = {}) {
  const res = await fetch(
    `${SALES_REPORT_API}/dashboard/sales-summary${toQueryString(params)}`,
    {
      method: "GET",
      headers: buildAuthHeaders(),
    }
  );

  return parseApiResponse(res, "Khong tai duoc tom tat bao cao Sales.");
}

export async function getSalesReport(params = {}) {
  const res = await fetch(
    `${SALES_REPORT_API}/reports/sales${toQueryString(params)}`,
    {
      method: "GET",
      headers: buildAuthHeaders(),
    }
  );

  return parseApiResponse(res, "Khong tai duoc bao cao Sales.");
}
