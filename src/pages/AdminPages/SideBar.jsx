import { Eye, Users, Shield, Settings, LogOut } from "lucide-react";

const navItems = [
  { label: "Tài khoản", value: "ACCOUNTS", icon: Users },
  { label: "Vai trò & Quyền", value: "ROLES", icon: Shield },
  { label: "Cấu hình", value: "SETTINGS", icon: Settings },
];

export default function SideBar({ activeNav, setActiveNav }) {
  return (
    <aside className="flex min-h-screen w-[300px] shrink-0 flex-col bg-[#071120] text-white">
      <div>
        <div className="flex items-center gap-4 border-b border-white/8 px-6 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-sm">
            <Eye size={22} className="text-white" />
          </div>

          <div>
            <h2 className="text-[22px] font-bold leading-tight text-white">
              System Admin
            </h2>
            <p className="mt-1 text-[15px] text-slate-300">Quản trị hệ thống</p>
          </div>
        </div>

        <nav className="px-3 py-5">
          <div className="space-y-2">
            {navItems.map(({ label, value, icon: Icon }) => {
              const isActive = activeNav === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveNav(value)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-[16px] font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-cyan-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-cyan-400" : "text-slate-400"}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-white/8 px-6 py-6">
        <div>
          <p className="text-[15px] font-semibold text-white">Admin System</p>
          <p className="mt-1 text-[13px] text-slate-400">admin@visioncare.vn</p>
        </div>

        <button className="mt-5 flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}