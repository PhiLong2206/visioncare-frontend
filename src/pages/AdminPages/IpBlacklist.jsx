import { useState, useEffect } from "react";
import { ShieldAlert, Plus, Trash2, Search, Globe, Lock, AlertCircle, Info } from "lucide-react";
import { getBlacklist, addToBlacklist, removeFromBlacklist } from "../../api/adminAPI";
import toast from "react-hot-toast";

export default function IpBlacklist() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newIp, setNewIp] = useState({ ipAddress: "", reason: "" });
  const [showAdd, setShowAdd] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await getBlacklist();
      setList(data);
    } catch (error) {
      toast.error("Không thể tải danh sách đen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addToBlacklist(newIp);
      toast.success("Đã thêm IP vào danh sách chặn");
      setNewIp({ ipAddress: "", reason: "" });
      setShowAdd(false);
      fetchList();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn bỏ chặn IP này?")) return;
    try {
      await removeFromBlacklist(id);
      toast.success("Đã gỡ chặn IP");
      fetchList();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredList = list.filter(item => 
    item.ipAddress.includes(searchTerm) || item.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">IP Blacklist</h1>
          <p className="mt-1 text-[16px] text-slate-500">Quản lý các địa chỉ IP bị chặn truy cập vào hệ thống</p>
        </div>

        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg transition hover:bg-slate-800"
        >
          <Plus size={18} />
          <span>Chặn IP mới</span>
        </button>
      </div>

      {showAdd && (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-in zoom-in-95 duration-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Lock size={18} className="text-rose-500" />
            Cấu hình chặn IP
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Nhập địa chỉ IP (VD: 192.168.1.100)"
              required
              value={newIp.ipAddress}
              onChange={(e) => setNewIp({...newIp, ipAddress: e.target.value})}
              className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-rose-500"
            />
            <input 
              type="text" 
              placeholder="Lý do chặn (VD: Spam, Tấn công Brute-force)"
              value={newIp.reason}
              onChange={(e) => setNewIp({...newIp, reason: e.target.value})}
              className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-rose-500"
            />
            <div className="flex gap-2">
              <button type="submit" className="h-12 flex-1 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition">
                Xác nhận chặn
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="h-12 px-6 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Tìm kiếm IP hoặc lý do..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-slate-300"
            />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                  <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Địa chỉ IP</th>
                  <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Lý do</th>
                  <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Thời gian</th>
                  <th className="px-6 py-5 text-right text-[13px] font-bold uppercase tracking-wider text-slate-500">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredList.map((item) => (
                  <tr key={item.id} className="group transition hover:bg-rose-50/30">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="text-slate-400" />
                        <span className="font-mono text-[14px] font-bold text-slate-900">{item.ipAddress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[14px] text-slate-600">{item.reason || "Không có lý do"}</td>
                    <td className="px-6 py-5 text-[14px] text-slate-500">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredList.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">Không có IP nào trong danh sách đen</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldAlert size={20} className="text-rose-500" />
              Cơ chế bảo vệ
            </h3>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Các IP trong danh sách này sẽ bị Middleware chặn ngay từ tầng ứng dụng, không thể truy cập bất kỳ tài nguyên nào của hệ thống.
            </p>
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Info size={14} className="text-blue-400" />
                <span>Chặn tự động sau 5 lần sai pass</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Info size={14} className="text-blue-400" />
                <span>Lọc theo dải IP (CIDR)</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-amber-50 p-6 flex gap-3">
            <AlertCircle size={20} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Thận trọng: Việc chặn nhầm IP của quản trị viên có thể dẫn đến việc bạn không thể truy cập vào hệ thống này.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
