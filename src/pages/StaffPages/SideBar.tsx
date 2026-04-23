import { CalendarClock, Eye, Clipboard, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Don hang", value: "ORDERS", icon: Clipboard },
  { label: "Pre-order", value: "PRE_ORDERS", icon: CalendarClock },
];

type SideBarProps = {
  activeNav: string;
  setActiveNav: (label: string) => void;
};

export default function SideBar({ activeNav, setActiveNav }: SideBarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="relative z-20 flex h-full w-64 shrink-0 flex-col bg-slate-900 px-6 py-8 text-white">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 shadow-lg shadow-teal-500/30">
          <Eye size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Sales Staff</h2>
          <p className="text-xs font-medium text-teal-400">Quản lý bán hàng</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ label, value, icon: Icon }) => {
          const isActive = activeNav === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setActiveNav(value)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition-all ${
                isActive
                  ? "bg-teal-500/10 text-teal-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-teal-400" : "text-slate-400"} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 border-t border-slate-800 pt-6">
        <div>
          <p className="text-sm font-semibold text-white">{user?.fullName || "VisionCare Staff"}</p>
          <p className="text-xs text-slate-400">{user?.email || "staff@visioncare.vn"}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
