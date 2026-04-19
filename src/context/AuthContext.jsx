import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const USER_STORAGE_KEY = "user";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const ROLE_MAP = {
  Admin: 1,
  Manager: 2,
  Sales: 3,
  Staff: 3,
  Operation: 4,
  Operations: 4,
  Customer: 5,
};

const STAFF_ROLE_IDS = [1, 2, 3, 4];
const STAFF_ROLE_NAMES = ["Admin", "Manager", "Sales", "Staff", "Operation", "Operations"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      const savedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (savedUser && savedAccessToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Lỗi đọc auth từ localStorage:", error);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);

  const normalizeRoleId = (data) => {
    // ưu tiên roleId nếu backend có trả
    if (data?.roleId != null && !Number.isNaN(Number(data.roleId))) {
      return Number(data.roleId);
    }

    // fallback từ role string
    if (data?.role && ROLE_MAP[data.role] != null) {
      return ROLE_MAP[data.role];
    }

    return null;
  };

  const login = async ({ email, password }) => {
    const res = await fetch(
      "https://escapable-exterior-tableware.ngrok-free.dev/api/Auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    console.log("LOGIN API RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập thất bại.");
    }

    const resolvedRoleId = normalizeRoleId(data);

    const authUser = {
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role ?? "",
      roleId: resolvedRoleId,
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken || "");
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken || "");

    setUser(authUser);

    console.log("AUTH USER NORMALIZED:", authUser);

    return authUser;
  };

  const register = async ({ name, email, phone, password }) => {
    const res = await fetch(
      "https://escapable-exterior-tableware.ngrok-free.dev/api/Auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          phoneNumber: phone,
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Đăng ký thất bại.");
    }

    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const isStaff = (targetUser = user) => {
    if (!targetUser) return false;

    if (targetUser.roleId != null) {
      return STAFF_ROLE_IDS.includes(Number(targetUser.roleId));
    }

    return STAFF_ROLE_NAMES.includes(targetUser.role);
  };

  const isCustomer = (targetUser = user) => {
    if (!targetUser) return false;

    if (targetUser.roleId != null) {
      return Number(targetUser.roleId) === 5;
    }

    return targetUser.role === "Customer";
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      isStaff,
      isCustomer,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}