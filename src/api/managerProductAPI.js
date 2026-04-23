const API_URL = "/api/v1/manager/products";
const PUBLIC_PRODUCT_API = "/api/Product";

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

export const getProducts = async (page = 1, pageSize = 100) => {
    const res = await fetch(`${PUBLIC_PRODUCT_API}?Page=${page}&PageSize=${pageSize}`, {
        method: "GET",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Lỗi khi tải danh sách sản phẩm");
};

export const createProduct = async (productData) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: buildAuthHeaders({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(productData),
    });
    return parseApiResponse(res, "Lỗi khi tạo sản phẩm mới");
};

export const updateProduct = async (id, productData) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: buildAuthHeaders({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(productData),
    });
    return parseApiResponse(res, "Lỗi khi cập nhật sản phẩm");
};

export const deleteProduct = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: buildAuthHeaders(),
    });
    return parseApiResponse(res, "Lỗi khi xóa sản phẩm");
};
