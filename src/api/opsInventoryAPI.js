const OPS_INVENTORY_API = "/api/v1/ops/inventory";

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

export async function getInventory(variantId) {
  const res = await fetch(`${OPS_INVENTORY_API}/${variantId}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc ton kho san pham.");
}

export async function getLowStock({ warehouseId, threshold = 10 } = {}) {
  const query = toQueryString({ warehouseId, threshold });
  const res = await fetch(`${OPS_INVENTORY_API}/low-stock${query}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc danh sach ton kho thap.");
}

export async function adjustInventory(payload) {
  const res = await fetch(`${OPS_INVENTORY_API}/adjust`, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong dieu chinh duoc ton kho.");
}

export async function replenishInventory(payload) {
  const res = await fetch(`${OPS_INVENTORY_API}/replenish`, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong nhap hang duoc.");
}

export async function getStockMovements(params = {}) {
  const query = toQueryString(params);
  const res = await fetch(`${OPS_INVENTORY_API}/movements${query}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc lich su xuat nhap kho.");
}

export async function getWarehouses() {
  const res = await fetch(`${OPS_INVENTORY_API}/warehouses`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc danh sach kho.");
}
