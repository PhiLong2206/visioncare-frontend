const OPS_ORDER_API = "/api/v1/ops/orders";

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

export async function getOpsOrders(params = {}) {
  const res = await fetch(`${OPS_ORDER_API}${toQueryString(params)}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc danh sach don hang Ops.");
}

export async function getOpsOrderDetail(id, isPreOrder = false) {
  const url = `${OPS_ORDER_API}/${id}${isPreOrder ? "?isPreOrder=true" : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc chi tiet don hang Ops.");
}

export async function getReadyMadeOrders(params = {}) {
  const res = await fetch(`${OPS_ORDER_API}/ready-made${toQueryString(params)}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc don ready-made.");
}

export async function getPrescriptionOrders(params = {}) {
  const res = await fetch(`${OPS_ORDER_API}/prescription${toQueryString(params)}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc don prescription.");
}

export async function getPreOrderOrders(params = {}) {
  const res = await fetch(`${OPS_ORDER_API}/pre-order${toQueryString(params)}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc don pre-order.");
}

export async function packOrder(id) {
  const res = await fetch(`${OPS_ORDER_API}/${id}/pack`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong cap nhat duoc trang thai dong goi.");
}

export async function updateOrderStatus(id, payload) {
  const res = await fetch(`${OPS_ORDER_API}/${id}/status`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong cap nhat duoc trang thai don hang.");
}

export async function getLensWork(id) {
  const res = await fetch(`${OPS_ORDER_API}/${id}/lens-work`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return parseApiResponse(res, "Khong tai duoc thong tin lens work.");
}

export async function assignLensWork(id, payload) {
  const res = await fetch(`${OPS_ORDER_API}/${id}/lens-work/assign`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong gan duoc nhan vien cat kinh.");
}

export async function completeLensWork(id, payload) {
  const res = await fetch(`${OPS_ORDER_API}/${id}/lens-work/complete`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong hoan thanh duoc lens work.");
}

export async function getPreOrderReceiveList(params = {}) {
  const res = await fetch(
    `${OPS_ORDER_API}/pre-order/receive${toQueryString(params)}`,
    {
      method: "GET",
      headers: buildAuthHeaders(),
    }
  );

  return parseApiResponse(res, "Khong tai duoc danh sach pre-order cho nhan hang.");
}

export async function receivePreOrder(id, payload) {
  const res = await fetch(`${OPS_ORDER_API}/pre-order/${id}/receive`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong xac nhan duoc pre-order ve kho.");
}

export async function fulfillPreOrder(id, payload) {
  const res = await fetch(`${OPS_ORDER_API}/pre-order/${id}/fulfill`, {
    method: "PUT",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Khong xu ly duoc fulfill pre-order.");
}

export async function markStockArrived(id) {
    const res = await fetch(`${OPS_ORDER_API}/pre-order/reservations/${id}/stock-arrived`, {
        method: "PUT",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Không thực hiện được báo có hàng.");
}
