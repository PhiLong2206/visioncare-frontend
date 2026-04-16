import React, { useState } from 'react';
import { 
  Eye, 
  X, 
  FileText, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

// --- Types & Mock Data ---
interface InventoryTicket {
  id: string;
  orderId: string | null;
  productName: string;
  quantity: number;
  price: string;
  total: string;
  supplier: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Hoàn thành';
  creator: string;
  opsNote?: string;
}

const data: InventoryTicket[] = [
  { id: 'NK-2024-001', orderId: 'VC-2024-003', productName: 'Titanium Rimless Pro', quantity: 5, price: '800.000 ₫', total: '4.000.000 ₫', supplier: 'Luxottica VN', status: 'Chờ duyệt', creator: 'Phạm Đức Dũng', opsNote: 'Nhập hàng pre-order cho đơn VC-2024-003' },
  { id: 'NK-2024-002', orderId: null, productName: 'Premium Clubmaster', quantity: 10, price: '700.000 ₫', total: '7.000.000 ₫', supplier: 'Essilor VN', status: 'Đã duyệt', creator: 'Phạm Đức Dũng' },
  { id: 'NK-2024-003', orderId: null, productName: 'Hộp đựng kính ca...', quantity: 50, price: '50.000 ₫', total: '2.500.000 ₫', supplier: 'Công ty Phụ kiện ABC', status: 'Hoàn thành', creator: 'Phạm Đức Dũng' },
];

const InventoryApproval = () => {
  const [selectedTicket, setSelectedTicket] = useState<InventoryTicket | null>(null);

  return (
    <div className="p-8 bg-white min-h-screen font-sans text-slate-800 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Duyệt phiếu nhập kho</h1>
          <p className="text-gray-500 mt-1">Phê duyệt phiếu nhập kho từ Operations Staff</p>
        </div>
        <div className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full text-xs font-medium border border-orange-100">
          1 phiếu chờ duyệt
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-100">
              <th className="pb-4 font-medium">Mã phiếu</th>
              <th className="pb-4 font-medium">Đơn hàng</th>
              <th className="pb-4 font-medium">Sản phẩm</th>
              <th className="pb-4 font-medium text-center">SL</th>
              <th className="pb-4 font-medium">Tổng tiền</th>
              <th className="pb-4 font-medium">Nhà cung cấp</th>
              <th className="pb-4 font-medium">Trạng thái</th>
              <th className="pb-4 font-medium">Người tạo</th>
              <th className="pb-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => (
              <tr key={item.id} className="text-sm group hover:bg-gray-50/50 transition-colors">
                <td className="py-5 font-medium">{item.id}</td>
                <td className="py-5">
                  {item.orderId ? (
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs border border-gray-200">
                      {item.orderId}
                    </span>
                  ) : '—'}
                </td>
                <td className="py-5 text-slate-600">{item.productName}</td>
                <td className="py-5 text-center">{item.quantity}</td>
                <td className="py-5 font-bold">{item.total}</td>
                <td className="py-5 text-gray-400">{item.supplier}</td>
                <td className="py-5">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-5 text-gray-500">{item.creator}</td>
                <td className="py-5 text-right">
                  <button 
                    onClick={() => setSelectedTicket(item)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Eye size={18} className="text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Overlay */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                  <FileText size={20} />
                </div>
                <h2 className="text-lg font-bold">Duyệt phiếu {selectedTicket.id}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <InfoItem label="Sản phẩm" value={selectedTicket.productName} isBold />
                <InfoItem label="Số lượng" value={selectedTicket.quantity.toString()} isBold />
                <InfoItem label="Đơn giá nhập" value={selectedTicket.price} isBold />
                <InfoItem label="Tổng tiền" value={selectedTicket.total} isBold underline />
                <InfoItem label="Nhà cung cấp" value={selectedTicket.supplier} isBold />
                <InfoItem label="Đơn hàng" value={selectedTicket.orderId || '—'} isBold />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Ghi chú Ops:</p>
                <p className="text-sm text-slate-700">{selectedTicket.opsNote || 'Không có ghi chú'}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Ghi chú Manager</label>
                <textarea 
                  placeholder="Nhập lý do duyệt / từ chối..."
                  className="w-full border border-teal-500/30 rounded-xl p-4 text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none min-h-[100px] bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  <CheckCircle2 size={18} />
                  Duyệt
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  <XCircle size={18} />
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const InfoItem = ({ label, value, isBold, underline }: { label: string, value: string, isBold?: boolean, underline?: boolean }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1 font-medium">{label}</p>
    <p className={`text-sm ${isBold ? 'font-bold text-slate-800' : 'text-slate-600'} ${underline ? 'border-b-2 border-slate-800 inline-block' : ''}`}>
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status }: { status: InventoryTicket['status'] }) => {
  const styles = {
    'Chờ duyệt': 'bg-orange-50 text-orange-500 border-orange-100',
    'Đã duyệt': 'bg-emerald-50 text-emerald-500 border-emerald-100',
    'Hoàn thành': 'bg-emerald-50 text-emerald-500 border-emerald-100', // Cùng màu trong ảnh
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default InventoryApproval;