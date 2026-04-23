import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  X, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getReceipts, 
  approvePurchaseRequest, 
  finalConfirmReceipt 
} from '../../../api/opsProcurementAPI';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
};

interface GoodsReceiptItem {
  goodsReceiptId: number;
  receiptCode: string;
  createdByName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  warehouseName: string;
  note?: string;
  proofImage?: string;
  items: any[];
}

const InventoryApproval = () => {
  const [receipts, setReceipts] = useState<GoodsReceiptItem[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<GoodsReceiptItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await getReceipts();
      setReceipts(data || []);
    } catch (error: any) {
      toast.error("Không tải được danh sách phiếu nhập.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleApprovePR = async (id: number) => {
    try {
      setActionLoading(true);
      await approvePurchaseRequest(id);
      toast.success("Đã duyệt và đặt hàng thành công.");
      setSelectedTicket(null);
      fetchReceipts();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi duyệt phiếu.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalConfirm = async (id: number) => {
    try {
      setActionLoading(true);
      await finalConfirmReceipt(id);
      toast.success("Đã xác nhận nhập kho thành công. Tồn kho đã được cập nhật.");
      setSelectedTicket(null);
      fetchReceipts();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xác nhận nhập kho.");
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = receipts.filter((r: GoodsReceiptItem) => r.status === 'PendingApproval').length;

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-800 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Duyệt phiếu nhập kho</h1>
          <p className="text-slate-500 mt-2 text-lg">Quản lý quy trình phê duyệt ngân sách và đối soát hàng về</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-2xl text-sm font-bold border border-orange-200 flex items-center gap-2 animate-pulse">
            <Clock size={16} />
            {pendingCount} phiếu chờ duyệt mới
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-8 py-6 font-semibold">Mã phiếu</th>
                <th className="px-8 py-6 font-semibold">Ngày tạo</th>
                <th className="px-8 py-6 font-semibold">Người tạo</th>
                <th className="px-8 py-6 font-semibold">Trạng thái</th>
                <th className="px-8 py-6 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400">Đang tải dữ liệu...</td>
                </tr>
              ) : receipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400">Chưa có phiếu nhập nào cần xử lý.</td>
                </tr>
              ) : receipts.map((item: GoodsReceiptItem) => (
                <tr key={item.goodsReceiptId} className="group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => setSelectedTicket(item)}>
                  <td className="px-8 py-6 font-bold text-slate-900">{item.receiptCode}</td>
                  <td className="px-8 py-6 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {item.createdByName?.charAt(0)}
                      </div>
                      <span className="font-medium">{item.createdByName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      className="p-3 bg-slate-100 text-slate-400 rounded-2xl group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-md transition-all border border-transparent group-hover:border-slate-100"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Overlay */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 p-3 rounded-2xl text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Chi tiết phiếu {selectedTicket.receiptCode}</h2>
                  <p className="text-slate-500 text-sm">Cần kiểm duyệt trước khi xác nhận</p>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8 mb-10">
                <InfoItem label="Trạng thái hiện tại" value={<StatusBadge status={selectedTicket.status} />} />
                <InfoItem label="Kho đích" value={selectedTicket.warehouseName} isBold />
                <InfoItem label="Nhân viên đề xuất" value={selectedTicket.createdByName} isBold />
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-slate-400" />
                  Danh mục hàng hóa
                </h3>
                <div className="space-y-3">
                  {selectedTicket.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">{item.productName}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.sku} | {item.variantInfo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">x{item.quantity}</p>
                        <p className="text-xs text-slate-400">{formatCurrency(item.unitPrice)} / đơn vị</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedTicket.proofImage || (selectedTicket as any).ProofImage) && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Eye size={20} className="text-slate-400" />
                    Bằng chứng hàng về (Ops cung cấp)
                  </h3>
                  <div className="rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-inner">
                    <img src={selectedTicket.proofImage || (selectedTicket as any).ProofImage} alt="Proof" className="w-full object-cover" />
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-6 rounded-[32px] mb-10 border border-slate-100">
                <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">Ghi chú từ hệ thống/Ops:</p>
                <p className="text-slate-700 font-medium italic">"{selectedTicket.note || 'Không có ghi chú kèm theo'}"</p>
              </div>

              {/* Action Logic */}
              <div className="flex gap-4 sticky bottom-0 bg-white pt-4">
                {selectedTicket.status === 'PendingApproval' && (
                  <button 
                    onClick={() => handleApprovePR(selectedTicket.goodsReceiptId)}
                    disabled={actionLoading}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <CheckCircle2 size={22} />
                    {actionLoading ? "Đang xử lý..." : "Duyệt và đặt hàng"}
                  </button>
                )}

                {selectedTicket.status === 'AwaitingConfirmation' && (
                  <button 
                    onClick={() => handleFinalConfirm(selectedTicket.goodsReceiptId)}
                    disabled={actionLoading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <ArrowRight size={22} />
                    {actionLoading ? "Đang xử lý..." : "Xác nhận nhập kho thực tế"}
                  </button>
                )}

                {(selectedTicket.status === 'PendingApproval' || selectedTicket.status === 'AwaitingConfirmation') && (
                  <button 
                    className="px-8 bg-white border-2 border-slate-100 hover:border-red-200 hover:text-red-600 text-slate-400 font-bold py-5 rounded-[24px] transition-all"
                  >
                    <XCircle size={22} />
                  </button>
                )}
                
                {selectedTicket.status === 'Completed' && (
                  <div className="w-full py-5 bg-emerald-50 text-emerald-700 rounded-[24px] text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} />
                    Phiếu đã hoàn thành & nhập kho
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value, isBold, underline }: { label: string, value: any, isBold?: boolean, underline?: boolean }) => (
  <div>
    <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">{label}</p>
    <div className={`text-lg ${isBold ? 'font-black text-slate-900' : 'text-slate-600'} ${underline ? 'border-b-4 border-slate-100 pb-1' : ''}`}>
      {value}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PendingApproval: "bg-orange-50 text-orange-600 border-orange-100",
    Approved: "bg-blue-50 text-blue-600 border-blue-100",
    AwaitingConfirmation: "bg-purple-50 text-purple-600 border-purple-100",
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  const labels: Record<string, string> = {
    PendingApproval: "Chờ duyệt",
    Approved: "Đang chờ hàng",
    AwaitingConfirmation: "Chờ xác nhận kho",
    Completed: "Đã nhập kho",
    Cancelled: "Đã hủy",
  };
  
  return (
    <span className={`px-4 py-1.5 rounded-2xl text-xs font-black border uppercase tracking-wider ${styles[status] || styles.PendingApproval}`}>
      {labels[status] || status}
    </span>
  );
};

const Package = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

export default InventoryApproval;