const AUTH_API = "/api/Auth";

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

export async function loginAuth(payload) {
  const res = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Đăng nhập thất bại.");
}

export async function registerAuth(payload) {
  const res = await fetch(`${AUTH_API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse(res, "Đăng ký thất bại.");
}

export async function logoutAuth(payload) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${AUTH_API}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  return parseApiResponse(res, "Đăng xuất thất bại.");
}
