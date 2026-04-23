import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, X } from 'lucide-react';

// Kiểu dữ liệu cho yêu cầu
interface RequestItem {
  id: string;
  customer: string;
  type: 'Đổi trả' | 'Bảo hành' | 'Hoàn tiền';
  reason: string;
  status: 'Chờ xác nhận' | 'Đã duyệt' | 'rejected';
  date: string;
}

const Refund = () => {
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [managerNote, setManagerNote] = useState('');

  // Dữ liệu mẫu dựa trên hình ảnh
  const data: RequestItem[] = [
    {
      id: 'VC-2024-001',
      customer: 'Nguyễn Văn An',
      type: 'Đổi trả',
      reason: 'Sản phẩm không đúng màu như hình',
      status: 'Chờ xác nhận',
      date: '2024-03-08',
    },
    {
      id: 'VC-2024-004',
      customer: 'Nguyễn Văn An',
      type: 'Bảo hành',
      reason: 'Kính bị trầy xước khi nhận hàng',
      status: 'Đã duyệt',
      date: '2024-03-22',
    },
    {
      id: 'VC-2024-005',
      customer: 'Trần Thị Bình',
      type: 'Hoàn tiền',
      reason: 'Muốn hoàn tiền do đặt nhầm',
      status: 'rejected',
      date: '2024-03-23',
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận': return 'bg-orange-100 text-orange-600 border border-orange-200';
      case 'Đã duyệt': return 'bg-green-100 text-green-600 border border-green-200';
      case 'rejected': return 'bg-red-100 text-red-600 border border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duyệt đổi trả / bảo hành</h1>
            <p className="text-gray-500 mt-1">Manager phê duyệt các yêu cầu khiếu nại từ khách hàng</p>
          </div>
          <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium border border-orange-100">
            1 chờ duyệt
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-sm">
                <th className="px-6 py-4 font-medium">Mã đơn</th>
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Loại</th>
                <th className="px-6 py-4 font-medium">Lý do</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Ngày</th>
                <th className="px-6 py-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.id}</td>
                  <td className="px-6 py-4">{item.customer}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs border border-gray-200">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{item.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedRequest(item)}
                      className="p-1 hover:text-blue-600 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Xử lý yêu cầu */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">Xử lý yêu cầu - {selectedRequest.id}</h2>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Khách hàng</p>
                    <p className="font-semibold text-gray-700">{selectedRequest.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Loại</p>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs border border-gray-200">
                      {selectedRequest.type}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Lý do</p>
                  <p className="font-semibold text-gray-700">{selectedRequest.reason}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Trạng thái</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-bold block mb-2">Ghi chú Manager</label>
                  <textarea 
                    className="w-full border border-teal-500 rounded-xl p-3 h-24 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-sm"
                    placeholder="Nhập lý do duyệt / từ chối..."
                    value={managerNote}
                    onChange={(e) => setManagerNote(e.target.value)}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 grid grid-cols-2 gap-4">
                <button 
                  className="flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white py-3 rounded-xl font-bold transition-colors"
                  onClick={() => setSelectedRequest(null)}
                >
                  <CheckCircle size={18} />
                  Duyệt
                </button>
                <button 
                  className="flex items-center justify-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white py-3 rounded-xl font-bold transition-colors"
                  onClick={() => setSelectedRequest(null)}
                >
                  <XCircle size={18} />
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Refund;