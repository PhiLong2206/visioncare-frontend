import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Package,
  Calendar,
  Users,
  Target,
  PlusCircle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Settings2,
} from "lucide-react";
import {
  getManagerCampaigns,
  createManagerCampaign,
  updateManagerCampaign,
  getManagerCampaignDetail,
} from "../../../api/managerPreOrderAPI";

type Campaign = {
  id: number;
  name: string;
  status: string;
  targetQuantity: number;
  orderedQuantity: number;
  startDate: string;
  endDate: string;
  releaseDate: string;
  depositRatio: number;
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-teal-50 text-teal-700 border-teal-200",
  fulfilled: "bg-blue-50 text-blue-700 border-blue-200",
  closed: "bg-slate-50 text-slate-700 border-slate-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  
  const [createForm, setCreateForm] = useState({
    campaignName: "",
    description: "",
    startDate: "",
    endDate: "",
    releaseDate: "",
    maxQuantity: "",
    depositRatio: "0.3",
    isFeatured: false,
  });

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getManagerCampaigns();
      setCampaigns(data || []);
    } catch (error: any) {
      toast.error(error.message || "Không tải được danh sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async () => {
    if (!createForm.campaignName.trim()) return toast.error("Nhập tên chiến dịch.");
    try {
      setActionLoading(true);
      await createManagerCampaign({
        ...createForm,
        maxQuantity: Number(createForm.maxQuantity) || 0,
        depositRatio: Number(createForm.depositRatio) || 0.3,
      });
      toast.success("Đã tạo chiến dịch.");
      setCreateForm({
        campaignName: "", description: "", startDate: "", endDate: "", releaseDate: "",
        maxQuantity: "", depositRatio: "0.3", isFeatured: false,
      });
      fetchCampaigns();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
      <div className="mb-10">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Chiến lược Đặt trước (Campaigns)</h1>
        <p className="text-slate-500 font-medium">Thiết lập và quản lý các chương trình pre-order toàn hệ thống.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <div className="h-10 w-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl mb-4">
               <Package size={20} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tổng chiến dịch</p>
            <p className="text-3xl font-black text-slate-900">{campaigns.length}</p>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <div className="h-10 w-10 flex items-center justify-center bg-teal-50 text-teal-600 rounded-xl mb-4">
               <Users size={20} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang chạy</p>
            <p className="text-3xl font-black text-teal-600">{campaigns.filter(c => c.status === 'active').length}</p>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <div className="h-10 w-10 flex items-center justify-center bg-amber-50 text-amber-600 rounded-xl mb-4">
               <Target size={20} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cần xử lý</p>
            <p className="text-3xl font-black text-amber-600">{campaigns.filter(c => c.status === 'fulfilled').length}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Form */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PlusCircle size={20} className="text-teal-600" /> Tạo chiến dịch mới
               </h3>
               
               <div className="space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tên chiến dịch</label>
                     <input 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-teal-400 focus:bg-white transition-all"
                        placeholder=" Polaroid Collection 2024"
                        value={createForm.campaignName}
                        onChange={e => setCreateForm(p => ({ ...p, campaignName: e.target.value }))}
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bắt đầu</label>
                        <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-xs outline-none focus:border-teal-400" value={createForm.startDate} onChange={e => setCreateForm(p => ({ ...p, startDate: e.target.value }))} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Kết thúc</label>
                        <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-xs outline-none focus:border-teal-400" value={createForm.endDate} onChange={e => setCreateForm(p => ({ ...p, endDate: e.target.value }))} />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bàn giao dự kiến</label>
                     <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400" value={createForm.releaseDate} onChange={e => setCreateForm(p => ({ ...p, releaseDate: e.target.value }))} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Tỉ lệ cọc</label>
                        <input type="number" step="0.1" className="bg-transparent font-black text-lg w-full outline-none" value={createForm.depositRatio} onChange={e => setCreateForm(p => ({ ...p, depositRatio: e.target.value }))} />
                     </div>
                     <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Mục tiêu</label>
                        <input type="number" className="bg-transparent font-black text-lg w-full outline-none" placeholder="100" value={createForm.maxQuantity} onChange={e => setCreateForm(p => ({ ...p, maxQuantity: e.target.value }))} />
                     </div>
                  </div>

                  <button 
                     disabled={actionLoading}
                     onClick={handleCreate}
                     className="w-full bg-slate-900 py-4 rounded-xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 mt-4"
                  >
                     Kích hoạt chiến dịch
                  </button>
               </div>
            </div>
         </div>

         {/* List */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400">Chiến dịch</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400">Tiến độ</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400">Trạng thái</th>
                        <th className="px-6 py-4"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {loading ? (
                        <tr><td colSpan={4} className="py-20 text-center font-bold text-slate-300">Đang tải...</td></tr>
                     ) : campaigns.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-5">
                              <p className="font-bold text-slate-900 text-sm uppercase">{c.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Release: {new Date(c.releaseDate).toLocaleDateString()}</p>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (c.orderedQuantity / (c.targetQuantity || 1)) * 100)}%` }}></div>
                                 </div>
                                 <span className="text-[11px] font-black text-slate-600">{c.orderedQuantity}/{c.targetQuantity}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${STATUS_STYLES[c.status.toLowerCase()] || 'bg-gray-50'}`}>
                                 {c.status}
                              </span>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <button onClick={async () => {
                                 const detail = await getManagerCampaignDetail(c.id);
                                 setSelectedCampaign(detail);
                              }} className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-blue-500 transition-colors">
                                 <Settings2 size={16} />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
