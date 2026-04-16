import {
  Eye,
  LayoutDashboard,
  Package,
  Banknote,
  Users,
  CreditCard,
  FileText,
  ChartColumn,
} from "lucide-react";

const navItems = [
  { text: "Dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { text: "Doanh thu", label: "REVENUE", icon: ChartColumn },
  { text: "Kho", label: "INVENTORY", icon: Package },
  { text: "Giá cả", label: "PRICING", icon: Banknote },
  { text: "Hoàn / Trả", label: "CLAIMS/REFUNDS", icon: CreditCard },
  { text: "Phiếu nhập kho", label: "RECEIPT", icon: FileText },
  { text: "Người dùng", label: "TEAM", icon: Users },
];

type SideBarProps = {
  activeNav: string;
  setActiveNav: (label: string) => void;
};

export default function SideBar({
  activeNav,
  setActiveNav,
}: SideBarProps) {
  return (
    <aside className="flex min-h-screen w-72 shrink-0 flex-col bg-slate-950 text-white">
      <div>
        <div className="flex items-center gap-4 border-b border-slate-800 px-6 py-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500">
            <Eye size={24} className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Manager
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Quản lý hệ thống vận hành
            </p>
          </div>
        </div>

        <nav className="px-3 py-6">
          <div className="space-y-2">
            {navItems.map(({ text, label, icon: Icon }) => {
              const isActive = activeNav === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveNav(label)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left text-smfont-semibold transition-all ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-400 shadow-sm"
                      : "text-slate-200 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon
                    size={22}
                    className={isActive ? "text-cyan-400" : "text-slate-300"}
                  />
                  <span>{text}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 px-6 py-6">
        <div>
          <p className="text-sm font-semibold text-white">VisionCare Manager</p>
          <p className="text-xs text-slate-400">manager@visioncare.vn</p>
        </div>
      </div>
    </aside>
  );
}