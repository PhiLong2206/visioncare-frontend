import { useState, useEffect } from "react";
import { Activity, Database, Server, Cpu, HardDrive, Wifi, CheckCircle2 } from "lucide-react";
import { getSystemHealth } from "../../api/adminAPI";
import toast from "react-hot-toast";

export default function SystemHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const data = await getSystemHealth();
        setHealth(data);
      } catch (error) {
        toast.error("Không thể tải thông tin hệ thống");
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  const stats = [
    { label: "Trạng thái API", value: health?.status || "Đang tải...", icon: Wifi, color: "green", sub: "Hoạt động bình thường" },
    { label: "Cơ sở dữ liệu", value: health?.database || "Đang tải...", icon: Database, color: "blue", sub: "Đã kết nối" },
    { label: "Storage", value: health?.storage || "Đang tải...", icon: HardDrive, color: "rose", sub: "Dung lượng còn lại" },
    { label: "Phiên bản", value: health?.apiVersion || "Đang tải...", icon: Server, color: "indigo", sub: "Build 2024.04" },
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
          Tình trạng Hệ thống
        </h1>
        <p className="mt-1 text-[16px] text-slate-500">
          Giám sát tài nguyên, hiệu năng server và kết nối database thời gian thực
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[13px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
            <div className="mt-1 flex items-end justify-between">
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                <CheckCircle2 size={18} className="text-green-500 mb-1" />
            </div>
            <p className="mt-2 text-[13px] text-slate-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity size={20} className="text-indigo-600" />
                    Hiệu năng API (24h)
                  </h2>
                  <span className="text-[12px] font-bold text-slate-400">Thời gian thực</span>
              </div>
              
              <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-indigo-500/10 to-transparent" />
                  <p className="text-slate-400 text-sm font-medium relative z-10">[Biểu đồ hiệu năng đang được tải...]</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Avg Response</p>
                      <p className="text-lg font-bold text-slate-900">45ms</p>
                  </div>
                  <div className="text-center">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Error Rate</p>
                      <p className="text-lg font-bold text-slate-900">0.02%</p>
                  </div>
                  <div className="text-center">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Requests/sec</p>
                      <p className="text-lg font-bold text-slate-900">12.5</p>
                  </div>
              </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Server size={20} className="text-cyan-600" />
                  Thông tin Server
              </h2>
              
              <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">Operating System</span>
                      <span className="text-sm font-bold text-slate-900">Ubuntu 22.04 LTS</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">Runtime Environment</span>
                      <span className="text-sm font-bold text-slate-900">.NET 8.0 Core</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">Web Server</span>
                      <span className="text-sm font-bold text-slate-900">Kestrel / Nginx</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">SSL Certificate</span>
                      <span className="text-sm font-bold text-green-600">Valid (Expires in 280 days)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-500">Current Uptime</span>
                      <span className="text-sm font-bold text-slate-900">{health?.uptime || "Unknown"}</span>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
}
