import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const ROLE_PATHS = {
  1: "/admin",
  2: "/manager",
  3: "/staff",
  4: "/operation",
  5: "/",
};

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRoleId = (authUser) => {
    if (!authUser) return null;

    // thử lấy roleId từ nhiều field backend có thể trả về
    const rawRole =
      authUser.roleId ??
      authUser.RoleId ??
      authUser.role ??
      authUser.Role ??
      authUser?.user?.roleId ??
      authUser?.user?.RoleId ??
      authUser?.user?.role ??
      authUser?.user?.Role;

    const roleId = Number(rawRole);
    return Number.isNaN(roleId) ? null : roleId;
  };

  const redirectByRole = (authUser) => {
    const roleId = getRoleId(authUser);

    console.log("authUser:", authUser);
    console.log("roleId detect:", roleId);

    const path = ROLE_PATHS[roleId] || "/";
    navigate(path, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      setIsSubmitting(true);

      const authUser = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Login response:", authUser);

      toast.success("Đăng nhập thành công!");
      redirectByRole(authUser);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Đăng nhập thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-sm md:p-10">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[24px] bg-gradient-to-r from-teal-500 to-blue-500 text-2xl font-bold text-white">
          VC
        </div>

        <h1 className="mt-6 text-center text-4xl font-bold text-slate-900">
          Đăng nhập VisionCare
        </h1>

        <p className="mt-3 text-center text-lg text-slate-500">
          Đăng nhập để tiếp tục mua sắm hoặc quản lý hệ thống
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-lg font-medium text-slate-900">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-lg font-medium text-slate-900">
              Mật khẩu
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none transition focus:border-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-8 text-center text-lg text-slate-500">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="font-semibold text-teal-600">
            Đăng ký
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;