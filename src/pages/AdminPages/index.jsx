import { useState } from "react";
import { Bell, ChevronLeft, Search } from "lucide-react";
import SideBar from "./SideBar";
import Accounts from "./Accounts";
import Roles from "./Roles";
import Settings from "./Settings";

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("ACCOUNTS");

  const renderContent = () => {
    switch (activeNav) {
      case "ACCOUNTS":
        return <Accounts />;
      case "ROLES":
        return <Roles />;
      case "SETTINGS":
        return <Settings />;
      default:
        return <Accounts />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-slate-800">
      <SideBar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-[74px] items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 transition hover:text-slate-800">
              <ChevronLeft size={20} />
            </button>
            <p className="text-[18px] font-semibold text-slate-800">
              System Admin
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="h-12 w-[344px] rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-slate-300"
              />
            </div>

            <button className="relative text-slate-400 transition hover:text-slate-700">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 text-sm font-bold text-white">
                A
              </div>
              <span className="text-[16px] font-semibold text-slate-800">
                Admin System
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-8 py-8">{renderContent()}</main>
      </div>
    </div>
  );
}