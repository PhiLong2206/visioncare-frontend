/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginAuth, logoutAuth, registerAuth } from "../api/authAPI";

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
const STAFF_ROLE_NAMES = [
  "Admin",
  "Manager",
  "Sales",
  "Staff",
  "Operation",
  "Operations",
];

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
      console.error("LÃ¡Â»â€”i Ã„â€˜Ã¡Â»Âc auth tÃ¡Â»Â« localStorage:", error);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);

  const normalizeRoleId = useCallback((data) => {
    if (data?.roleId != null && !Number.isNaN(Number(data.roleId))) {
      return Number(data.roleId);
    }

    if (data?.role && ROLE_MAP[data.role] != null) {
      return ROLE_MAP[data.role];
    }

    return null;
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await loginAuth({
        email,
        password,
      });

      console.log("LOGIN API RESPONSE:", data);

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
    },
    [normalizeRoleId]
  );

  const register = useCallback(async ({ name, email, phone, password }) => {
    return registerAuth({
      fullName: name,
      email,
      password,
      phoneNumber: phone,
    });
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      await logoutAuth(refreshToken ? { refreshToken } : undefined);
    } catch (error) {
      console.error("Loi goi API logout:", error);
    } finally {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, []);

  const isStaff = useCallback(
    (targetUser = user) => {
      if (!targetUser) return false;

      if (targetUser.roleId != null) {
        return STAFF_ROLE_IDS.includes(Number(targetUser.roleId));
      }

      return STAFF_ROLE_NAMES.includes(targetUser.role);
    },
    [user]
  );

  const isCustomer = useCallback(
    (targetUser = user) => {
      if (!targetUser) return false;

      if (targetUser.roleId != null) {
        return Number(targetUser.roleId) === 5;
      }

      return targetUser.role === "Customer";
    },
    [user]
  );

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
    [isCustomer, isStaff, login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
