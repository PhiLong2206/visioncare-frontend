import { useState, useEffect } from "react";
import { Search, Filter, FileText, Download, Clock, User, Activity, ChevronRight, X, Info } from "lucide-react";
import { getAuditLogs } from "../../api/adminAPI";
import toast from "react-hot-toast";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getAuditLogs();
      setLogs(data);
    } catch (error) {
      toast.error("Không thể tải nhật ký hoạt động");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action) => {
    if (action.includes("CREATE")) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (action.includes("DELETE")) return "text-rose-600 bg-rose-50 border-rose-100";
    if (action.includes("UPDATE") || action.includes("CHANGE") || action.includes("TOGGLE")) return "text-cyan-600 bg-cyan-50 border-cyan-100";
    return "text-slate-600 bg-slate-50 border-slate-100";
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="mt-1 text-[16px] text-slate-500">Nhật ký hoạt động hệ thống và truy vết thao tác người dùng</p>
        </div>

        <button 
          onClick={() => toast.success("Đang xuất báo cáo CSV...")}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-[14px] font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Download size={18} />
          <span>Xuất báo cáo (CSV)</span>
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm kiếm hành động, người dùng hoặc đối tượng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
              <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Thời gian</th>
              <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Người thực hiện</th>
              <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Hành động</th>
              <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Đối tượng</th>
              <th className="px-6 py-5 text-right text-[13px] font-bold uppercase tracking-wider text-slate-500">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLogs.map((log) => (
              <tr key={log.auditId} className="group transition hover:bg-slate-50/80">
                <td className="px-6 py-5">
                    <div className="flex items-center gap-3 text-[14px] text-slate-600">
                        <Clock size={16} className="text-slate-400" />
                        {new Date(log.createdAt).toLocaleString()}
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px]">
                            {log.userFullName?.charAt(0)}
                        </div>
                        {log.userFullName}
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                </td>
                <td className="px-6 py-5">
                    <div className="text-[14px]">
                        <span className="font-medium text-slate-500">{log.entityName}:</span>{" "}
                        <span className="font-bold text-slate-700">#{log.entityId}</span>
                    </div>
                </td>
                <td className="px-6 py-5 text-right">
                    <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-cyan-600 transition"
                    >
                        <Info size={20} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Chi tiết hoạt động</h2>
                    <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-400 hover:text-slate-600 transition">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Hành động</p>
                            <p className="mt-1 font-bold text-slate-900">{selectedLog.action}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Thời gian</p>
                            <p className="mt-1 text-slate-700">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Đối tượng</p>
                            <p className="mt-1 font-bold text-slate-900">{selectedLog.entityName} #{selectedLog.entityId}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Địa chỉ IP</p>
                            <p className="mt-1 text-slate-700">{selectedLog.ipAddress || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-3 text-rose-500">Giá trị cũ</p>
                        <p className="text-sm font-mono text-slate-600 whitespace-pre-wrap">{selectedLog.oldValues || "Không có dữ liệu cũ"}</p>
                    </div>
                    <div className="rounded-2xl bg-cyan-50 p-6 border border-cyan-100">
                        <p className="text-xs font-bold text-cyan-600 uppercase mb-3">Giá trị mới</p>
                        <p className="text-sm font-mono text-cyan-700 whitespace-pre-wrap">{selectedLog.newValues || "Không có thay đổi dữ liệu"}</p>
                    </div>
                </div>

                <button 
                    onClick={() => setSelectedLog(null)}
                    className="mt-8 w-full h-12 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                >
                    Đóng cửa sổ
                </button>
            </div>
        </div>
      )}
    </section>
  );
}
