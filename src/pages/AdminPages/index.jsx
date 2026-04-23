import { useState } from "react";
import { 
  Bell, ChevronLeft, Search, Mail, CreditCard, Truck, 
  ShieldAlert, FileText, Activity, AlertTriangle, 
  Image as ImageIcon, Globe, LogOut 
} from "lucide-react";
import SideBar from "./SideBar";
import Dashboard from "./Dashboard";
import Accounts from "./Accounts";
import Roles from "./RolesPermissions";
import Settings from "./Settings";
import AuditLogs from "./AuditLogs";
import SystemHealth from "./SystemHealth";
import ErrorLogs from "./ErrorLogs";
import EmailSettings from "./EmailSettings";
import PaymentGateways from "./PaymentGateways";
import ShippingConfig from "./ShippingConfig";
import IpBlacklist from "./IpBlacklist";
import MediaLibrary from "./MediaLibrary";
import CmsConfig from "./CmsConfig";

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("DASHBOARD");

  const renderContent = () => {
    switch (activeNav) {
      case "DASHBOARD":
        return <Dashboard />;
      case "USER_ACCOUNTS":
        return <Accounts />;
      case "ROLES_PERMISSIONS":
        return <Roles />;
      case "GENERAL_CONFIG":
      case "SETTINGS":
        return <Settings />;
      case "EMAIL_NOTIFICATION":
        return <EmailSettings />;
      case "PAYMENT_GATEWAYS":
        return <PaymentGateways />;
      case "SHIPPING_CONFIG":
        return <ShippingConfig />;
      case "IP_BLACKLIST":
        return <IpBlacklist />;
      case "AUDIT_LOGS":
        return <AuditLogs />;
      case "SYSTEM_HEALTH":
        return <SystemHealth />;
      case "ERROR_LOGS":
        return <ErrorLogs />;
      case "MEDIA_LIBRARY":
        return <MediaLibrary />;
      case "CMS_CONFIG":
        return <CmsConfig />;
      default:
        return <Accounts />;
    }
  };

  const PlaceholderSection = ({ title, description, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm border border-slate-100">
            <Icon size={40} className="text-cyan-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 max-w-md text-slate-500">{description}</p>
        <button className="mt-8 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
            Đang phát triển...
        </button>
    </div>
  );

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

            <div className="h-8 w-[1px] bg-slate-200 mx-2" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-bold text-slate-900 leading-none">Admin System</p>
                <p className="text-[11px] text-slate-500 mt-1">admin@visioncare.vn</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[13px] font-bold text-white shadow-lg">
                AD
              </div>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-8 py-8">{renderContent()}</main>
      </div>
    </div>
  );
}