import { Eye, Clipboard } from "lucide-react";

const navItems = [{ label: "Đơn hàng", value: "ĐƠN HÀNG", icon: Clipboard }];

type SideBarProps = {
  activeNav: string;
  setActiveNav: (label: string) => void;
};

export default function SideBar({ activeNav, setActiveNav }: SideBarProps) {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-950 text-white">
      <div>
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500">
            <Eye size={20} className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Sales Staff</h2>
            <p className="text-sm text-slate-400">Quản lý đơn hàng bán hàng</p>
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
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-800 text-cyan-400"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-cyan-400" : "text-slate-300"}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 px-5 py-5">
       <p className="text-sm font-semibold text-white">VisionCare Staff</p>
          <p className="text-xs text-slate-400">staff@visioncare.vn</p>
      </div>
    </aside>
  );
}