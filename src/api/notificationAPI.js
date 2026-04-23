const NOTIFICATION_API = "/api/v1/notifications";

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

export async function getNotifications() {
  const res = await fetch(NOTIFICATION_API, {
    method: "GET",
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không tải được thông báo.");
}

export async function markAsRead(id) {
  const res = await fetch(`${NOTIFICATION_API}/${id}/read`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không cập nhật được trạng thái thông báo.");
}

export async function getUnreadCount() {
  const res = await fetch(`${NOTIFICATION_API}/unread-count`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không tải được số lượng thông báo chưa đọc.");
}
