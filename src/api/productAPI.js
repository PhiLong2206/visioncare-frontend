const PRODUCT_API = "/api/Product";

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

export async function getProducts(params = {}) {
  const res = await fetch(`${PRODUCT_API}${toQueryString(params)}`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });

  return parseApiResponse(res, "Khong tai duoc danh sach san pham.");
}

export async function getProductById(id) {
  const res = await fetch(`${PRODUCT_API}/${id}`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });

  return parseApiResponse(res, "Khong tai duoc chi tiet san pham.");
}
