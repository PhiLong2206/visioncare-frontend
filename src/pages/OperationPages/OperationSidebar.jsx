import { PackageCheck, Truck } from "lucide-react";

const navItems = [
  {
    key: "ORDER_PROCESSING",
    label: "Xử lý đơn hàng",
    icon: PackageCheck,
  },
  {
    key: "DELIVERY",
    label: "Giao hàng",
    icon: Truck,
  },
];


export default function OperationSidebar({ activeNav, setActiveNav, user }) {
  return (
    <aside className="flex h-full w-[230px] flex-col border-r border-slate-800 bg-[#0b1724] text-white">
      <div className="border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-sm font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase() || "O"}
          </div>
          <div>
            <p className="text-lg font-semibold">Operations</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-slate-800 text-cyan-400"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-4 py-4">
        <p className="text-sm font-semibold text-white">{user?.fullName}</p>
        <p className="text-xs text-slate-400">{user?.email}</p>
      </div>
    </aside>
  );
}