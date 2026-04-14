import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartCount } = useCart();
  const { user, isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    toast.success("Đăng nhập thành công!");
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 font-bold text-white">
            VC
          </div>
          <span className="text-xl font-semibold text-slate-900">
            VisionCare
          </span>
        </Link>

        <div className="hidden items-center gap-8 font-medium text-slate-600 md:flex">
          <Link to="/" className="hover:text-slate-900">
            Trang chủ
          </Link>

          <Link to="/products" className="hover:text-slate-900">
            Sản phẩm
          </Link>

          <Link to="/orders" className="hover:text-slate-900">
            Đơn hàng
          </Link>

          <Link to="/cart" className="relative hover:text-slate-900">
            Giỏ hàng
            {cartCount > 0 && (
              <span className="absolute -right-5 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 md:inline-flex">
                Xin chào, {user.name}
              </span>

              <Link
                to="/dashboard"
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleLogin}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Đăng nhập
              </button>

              <button
                type="button"
                onClick={handleLogin}
                className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;