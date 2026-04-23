import {
  Eye,
  LayoutDashboard,
  Package,
  Banknote,
  Users,
  CreditCard,
  FileText,
  ChartColumn,
  Rocket,
} from "lucide-react";

const navItems = [
  { text: "Dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { text: "Doanh thu", label: "REVENUE", icon: ChartColumn },
  { text: "Sản phẩm", label: "PRODUCTS", icon: Package },
  { text: "Phiếu nhập kho", label: "RECEIPT", icon: FileText },
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 shadow-xl shadow-cyan-500/20">
            <Eye size={24} className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase italic">
              Manager
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              VisionCare Admin
            </p>
          </div>
        </div>

        <nav className="px-3 py-6">
          <div className="space-y-1">
            {navItems.map(({ text, label, icon: Icon }) => {
              const isActive = activeNav === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveNav(label)}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-sm font-bold transition-all ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-white"}
                  />
                  <span>{text}</span>
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400"></div>}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 px-6 py-6">
        <div>
          <p className="text-sm font-bold text-white">System Control</p>
          <p className="text-xs text-slate-500">v2.5.0-stable</p>
        </div>
      </div>
    </aside>
  );
}