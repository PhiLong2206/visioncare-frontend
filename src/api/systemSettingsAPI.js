const API_URL = "/api/SystemSettings";

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
    "Accept": "application/json",
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

export const getSystemSettings = async () => {
  const res = await fetch(API_URL, {
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể tải cài đặt");
};

export const updateSystemSettings = async (settings) => {
  const res = await fetch(`${API_URL}/bulk-update`, {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(settings),
  });
  return parseApiResponse(res, "Cập nhật thất bại");
};

export const getShippingSettings = async () => {
  try {
    const settings = await getSystemSettings();
    return {
      innerCityFee: parseInt(settings.find((s) => s.settingKey === "ShippingInnerCityFee")?.settingValue || "25000"),
      outerCityFee: parseInt(settings.find((s) => s.settingKey === "ShippingOuterCityFee")?.settingValue || "35000"),
      freeThreshold: parseInt(settings.find((s) => s.settingKey === "ShippingFreeThreshold")?.settingValue || "2000000"),
    };
  } catch (error) {
    console.error("Failed to fetch shipping settings:", error);
    return { innerCityFee: 30000, outerCityFee: 30000, freeThreshold: 2000000 };
  }
};
