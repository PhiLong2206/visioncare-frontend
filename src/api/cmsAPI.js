const CMS_API = "/api/Cms";

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

export const getCmsPages = async () => {
  const res = await fetch(`${CMS_API}/pages`, {
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể tải danh sách trang CMS");
};

export const createCmsPage = async (page) => {
  const res = await fetch(`${CMS_API}/pages`, {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(page),
  });
  return parseApiResponse(res, "Tạo trang CMS thất bại");
};

export const updateCmsPage = async (id, page) => {
  const res = await fetch(`${CMS_API}/pages/${id}`, {
    method: "PUT",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(page),
  });
  return parseApiResponse(res, "Cập nhật trang CMS thất bại");
};

export const deleteCmsPage = async (id) => {
  const res = await fetch(`${CMS_API}/pages/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(),
  });
  if (res.status === 204) return true;
  return parseApiResponse(res, "Xóa trang CMS thất bại");
};
