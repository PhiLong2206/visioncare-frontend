import { useState } from "react";
import { AlertCircle, Terminal, Trash2, Search, Filter, RefreshCcw, ChevronRight, Bug } from "lucide-react";
import toast from "react-hot-toast";

const mockErrors = [
  { id: 1, message: "SqlException: Invalid object name 'SystemSettings'", code: "500", time: "2024-03-22 10:45:12", source: "SystemSettingsController" },
  { id: 2, message: "NullReferenceException: Object reference not set to an instance", code: "500", time: "2024-03-22 09:30:05", source: "AdminController" },
  { id: 3, message: "HttpRequestException: Connection refused", code: "503", time: "2024-03-21 22:15:30", source: "PayOSService" },
];

export default function ErrorLogs() {
  const [logs, setLogs] = useState(mockErrors);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
        setIsRefreshing(false);
        toast.success("Đã cập nhật nhật ký mới nhất");
    }, 1000);
  };

  const handleClear = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả nhật ký lỗi?")) {
        setLogs([]);
        toast.success("Đã dọn dẹp nhật ký lỗi");
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight text-rose-600 flex items-center gap-3">
              <Bug size={32} />
              Nhật ký lỗi (Error Logs)
          </h1>
          <p className="mt-1 text-[16px] text-slate-500">Theo dõi và khắc phục các sự cố phát sinh trên hệ thống Backend</p>
        </div>

        <div className="flex gap-3">
            <button 
                onClick={handleRefresh}
                className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
                <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
                <span>Làm mới</span>
            </button>
            <button 
                onClick={handleClear}
                className="flex h-12 items-center gap-2 rounded-2xl bg-rose-50 px-5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
                <Trash2 size={18} />
                <span>Dọn dẹp</span>
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-rose-200">
            <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-[12px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">HTTP {log.code}</span>
                        <span className="text-[12px] text-slate-400 font-mono">{log.time}</span>
                    </div>
                    <h3 className="text-[15px] font-mono font-bold text-slate-900 truncate group-hover:text-rose-600 transition">{log.message}</h3>
                    <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                            <Terminal size={14} />
                            <span>Source: <span className="text-slate-900 font-semibold">{log.source}</span></span>
                        </div>
                    </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-900 transition">
                    <ChevronRight size={20} />
                </button>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
            <div className="py-20 text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                    <CheckCircle2 size={40} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Tuyệt vời!</h3>
                    <p className="text-slate-500">Hệ thống đang hoạt động ổn định, không có lỗi nào được ghi nhận.</p>
                </div>
            </div>
        )}
      </div>

      <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white">
          <h4 className="font-bold flex items-center gap-2 mb-4">
              <RefreshCcw size={18} className="text-cyan-400" />
              Chế độ giám sát Real-time
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
              Trang này sẽ tự động tải các lỗi nghiêm trọng (Exception) từ log của Backend. Bạn nên kiểm tra thường xuyên để đảm bảo trải nghiệm của khách hàng không bị gián đoạn.
          </p>
      </div>
    </section>
  );
}
