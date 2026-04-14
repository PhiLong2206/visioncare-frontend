import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại.");
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
          Đăng ký tài khoản
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-lg font-medium text-slate-900">
              Họ tên
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none transition focus:border-slate-400"
            />
          </div>

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
              Số điện thoại
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="0901234567"
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

          <div>
            <label className="mb-2 block text-lg font-medium text-slate-900">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none transition focus:border-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-8 text-center text-lg text-slate-500">
          Đã có tài khoản?{" "}
          <Link to="/login" className="font-semibold text-teal-600">
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;