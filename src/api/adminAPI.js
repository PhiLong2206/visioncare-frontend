const ADMIN_API = "/api/Admin";

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

export const getDashboardStats = async () => {
  const res = await fetch(`${ADMIN_API}/stats`, {
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể tải số liệu thống kê");
};

export const getAllUsers = async () => {
  const res = await fetch(`${ADMIN_API}/users`, {
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể tải danh sách tài khoản");
};

export const createUser = async (userData) => {
  const res = await fetch(`${ADMIN_API}/users`, {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(userData),
  });
  return parseApiResponse(res, "Tạo tài khoản thất bại");
};

export const toggleUserStatus = async (userId) => {
  const res = await fetch(`${ADMIN_API}/users/${userId}/toggle-status`, {
    method: "POST",
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Thao tác thất bại");
};

export const changeUserRole = async (userId, roleId) => {
  const res = await fetch(`${ADMIN_API}/users/${userId}/change-role`, {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(roleId),
  });
  return parseApiResponse(res, "Thay đổi vai trò thất bại");
};

export const resetPassword = async (userId, newPassword) => {
  const res = await fetch(`${ADMIN_API}/users/${userId}/reset-password`, {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(newPassword),
  });
  return parseApiResponse(res, "Đặt lại mật khẩu thất bại");
};

export const getRoles = async () => {
  const res = await fetch(`${ADMIN_API}/roles`, {
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể tải danh sách quyền");
};

export const createRole = async (roleName) => {
  const res = await fetch(`${ADMIN_API}/roles`, {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(roleName),
  });
  return parseApiResponse(res, "Tạo vai trò thất bại");
};

export const deleteRole = async (id) => {
  const res = await fetch(`${ADMIN_API}/roles/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(),
  });
  if (res.status === 204) return true;
  return parseApiResponse(res, "Xóa vai trò thất bại");
};

export const updateRolePermissions = async (roleId, permissions) => {
  const res = await fetch(`${ADMIN_API}/roles/${roleId}/permissions`, {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(permissions),
  });
  return parseApiResponse(res, "Cập nhật quyền hạn thất bại");
};

export const initPermissions = async () => {
  const res = await fetch(`${ADMIN_API}/init-permissions`, {
    method: "POST",
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Khởi tạo quyền hạn thất bại");
};

export const getBlacklist = async () => {
  const res = await fetch(`${ADMIN_API}/blacklist`, {
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể tải danh sách đen");
};

export const addToBlacklist = async (ipData) => {
  const res = await fetch(`${ADMIN_API}/blacklist`, {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(ipData),
  });
  return parseApiResponse(res, "Thêm IP vào danh sách đen thất bại");
};

export const removeFromBlacklist = async (id) => {
  const res = await fetch(`${ADMIN_API}/blacklist/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(),
  });
  if (res.status === 204) return true;
  return parseApiResponse(res, "Xóa IP khỏi danh sách đen thất bại");
};

export const getAuditLogs = async () => {
  const res = await fetch(`${ADMIN_API}/audit-logs`, {
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể tải nhật ký");
};

export const getSystemHealth = async () => {
  const res = await fetch(`${ADMIN_API}/system-health`, {
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể tải thông tin hệ thống");
};
