const SUPPLIER_API = "/api/v1/suppliers";

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

export async function getSuppliers() {
  const res = await fetch(SUPPLIER_API, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc danh sach nha cung cap.");
}

export async function getActiveSuppliers() {
  const res = await fetch(`${SUPPLIER_API}/active`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc danh sach nha cung cap dang hoat dong.");
}

export async function getSupplierById(id) {
  const res = await fetch(`${SUPPLIER_API}/${id}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc chi tiet nha cung cap.");
}

export async function createSupplier(payload) {
  const res = await fetch(SUPPLIER_API, {
    method: "POST",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong tao duoc nha cung cap.");
}

export async function updateSupplier(id, payload) {
  const res = await fetch(`${SUPPLIER_API}/${id}`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong cap nhat duoc nha cung cap.");
}

export async function deleteSupplier(id) {
  const res = await fetch(`${SUPPLIER_API}/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong xoa duoc nha cung cap.");
}
