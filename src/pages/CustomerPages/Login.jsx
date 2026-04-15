import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const STAFF_ROLE_IDS = [1, 2, 3];
const STAFF_ROLE_NAMES = ["Admin", "Manager", "Sales"];
const OPERATION_ROLE_ID = 4;
const OPERATION_ROLE_NAME = "Operations";

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

  const isGeneralStaffUser = (authUser) => {
    if (!authUser) return false;

    if (authUser.roleId != null) {
      return STAFF_ROLE_IDS.includes(Number(authUser.roleId));
    }

    return STAFF_ROLE_NAMES.includes(authUser.role);
  };

  const isOperationUser = (authUser) => {
    if (!authUser) return false;

    if (authUser.roleId != null) {
      return Number(authUser.roleId) === OPERATION_ROLE_ID;
    }

    return authUser.role === OPERATION_ROLE_NAME;
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
        email: formData.email,
        password: formData.password,
      });

      toast.success("Đăng nhập thành công!");

      if (isOperationUser(authUser)) {
        navigate("/operation");
      } else if (isGeneralStaffUser(authUser)) {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
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