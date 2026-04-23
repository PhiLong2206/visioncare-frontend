import { 
  Eye, Users, Shield, Settings, LogOut, Truck, Mail, 
  CreditCard, Activity, FileText, Image as ImageIcon, 
  Lock, Globe, AlertTriangle, ShieldAlert
} from "lucide-react";

const sidebarCategories = [
  {
    title: "Thống kê & Giám sát",
    items: [
      { label: "Tổng quan", value: "DASHBOARD", icon: Activity },
    ]
  },
  {
    title: "Quản trị Hệ thống",
    items: [
      { label: "Cấu hình chung", value: "GENERAL_CONFIG", icon: Settings },
      { label: "Cấu hình Giao vận", value: "SHIPPING_CONFIG", icon: Truck },
    ]
  },
  {
    title: "Phân quyền & Bảo mật",
    items: [
      { label: "Nhóm quyền (Roles)", value: "ROLES_PERMISSIONS", icon: Lock },
      { label: "Quản lý Tài khoản", value: "USER_ACCOUNTS", icon: Users },
      { label: "IP Blacklist", value: "IP_BLACKLIST", icon: ShieldAlert },
    ]
  }
];

export default function SideBar({ activeNav, setActiveNav }) {
  return (
    <aside className="flex min-h-screen w-[300px] shrink-0 flex-col bg-[#071120] text-white">
      <div className="sticky top-0 overflow-y-auto max-h-screen no-scrollbar flex-1">
        <div className="flex items-center gap-4 border-b border-white/8 px-6 py-6 bg-[#071120]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-sm">
            <Eye size={22} className="text-white" />
          </div>

          <div>
            <h2 className="text-[20px] font-bold leading-tight text-white">
              System Admin
            </h2>
            <p className="mt-1 text-[13px] text-slate-400">VisionCare OS v2.0</p>
          </div>
        </div>

        <nav className="px-3 py-6 space-y-8">
          {sidebarCategories.map((category) => (
            <div key={category.title} className="space-y-2">
              <h3 className="px-5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.items.map(({ label, value, icon }) => {
                  const isActive = activeNav === value;
                  const Icon = icon;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActiveNav(value)}
                      className={`flex w-full items-center gap-3 rounded-xl px-5 py-3 text-left text-[14px] font-medium transition-all ${
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400 shadow-sm"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={isActive ? "text-cyan-400" : "text-slate-500"}
                      />
                      <span>{label}</span>
                      {isActive && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
