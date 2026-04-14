import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const STORAGE_KEY = "visioncare_auth_user";

const demoUsers = [
  {
    id: 1,
    name: "Khách hàng demo",
    email: "customer@visioncare.vn",
    password: "123456",
    role: "customer",
  },
  {
    id: 2,
    name: "Nhân viên demo",
    email: "staff@visioncare.vn",
    password: "123456",
    role: "staff",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async ({ email, password }) => {
    const foundUser = demoUsers.find(
      (item) => item.email === email && item.password === password
    );

    if (!foundUser) {
      throw new Error("Email hoặc mật khẩu không đúng.");
    }

    const authUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };

    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

    return authUser;
  };

  const register = async ({ name, email, phone, password }) => {
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      role: "customer",
    };

    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}