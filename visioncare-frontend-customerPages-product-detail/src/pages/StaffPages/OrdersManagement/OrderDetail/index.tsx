import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, ShoppingCart, 
  MessageSquare, Send, RotateCcw, Plus, 
  ChevronRight, CheckCircle2, ShieldAlert, PauseCircle
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/staff">ORDERS</Link> <ChevronRight size={14} /> <span>#{id || 'VC-88291'}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Xem lại chỉ số</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-teal-700 text-white rounded-md font-medium flex items-center gap-2 hover:bg-teal-800 transition-colors">
            Xác nhận và gửi cho bộ phận vận hành <Send size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Patient & Order Info */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          
          {/* Patient Card */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <User size={24} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">Julianne Sterling</h2>
            <p className="text-sm text-slate-500 mb-6">Mã Bệnh Nhân: #PS-4492-B</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span>j.sterling@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-slate-400" />
                <span>+1 (555) 012-3456</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                <span>1282 Oakwood Ave, San Francisco, CA</span>
              </div>
            </div>
          </section>

          {/* Order Details */}
          <section className="bg-slate-50/50 rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 font-bold mb-4 uppercase text-xs tracking-widest text-slate-500">
              <ShoppingCart size={16} /> Order Details
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Mô Hình Gọng Kính</span>
                <span className="font-semibold text-right">Aura Modern Rectangular - Matte Black</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chất Liệu Tròng Kính</span>
                <span className="font-semibold">1.67 High-Index Clear</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lớp Phủ</span>
                <span className="font-semibold">Blue Light + Anti-Glare</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold">Tổng</span>
                <span className="text-xl font-bold text-teal-700">$429.00</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Prescription Data */}
        <div className="col-span-12 lg:col-span-9 space-y-6 relative">

          {/* Data Extraction Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold">Dữ liệu chỉ số được trích xuất</h2>
                <p className="text-sm text-slate-500">Kiểm tra kết quả nhận dạng ký tự quang học tự động so với bản quét gốc.</p>
              </div>
              <button className="p-2 bg-slate-100 rounded-lg text-teal-600 hover:bg-slate-200 transition-colors">
                <RotateCcw size={20} />
              </button>
            </div>

            {/* Grid Table */}
            <div className="space-y-4">
              {/* Row Header - Invisible on Mobile, visible here for structure */}
              <div className="grid grid-cols-6 gap-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="col-span-1"></div>
                <div>Độ Cầu (SPH)</div>
                <div>Độ Loạn (CYL)</div>
                <div>Trục Loạn</div>
                <div>Độ Thêm</div>
                <div>Lăng kính</div>
              </div>

              {/* Right Eye (OD) */}
              <div className="grid grid-cols-6 gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex flex-col items-center">
                  <div className="bg-teal-700 text-white text-xs font-bold w-10 h-10 rounded-lg flex items-center justify-center mb-1">OD</div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase">Mắt Phải</span>
                </div>
                <input type="text" defaultValue="-2.50" className="bg-white border border-slate-200 rounded-md p-3 text-center font-bold" />
                <input type="text" defaultValue="-0.75" className="bg-white border border-slate-200 rounded-md p-3 text-center font-bold" />
                <input type="text" defaultValue="165" className="bg-white border border-slate-200 rounded-md p-3 text-center font-bold" />
                <input type="text" defaultValue="+2.25" className="bg-white border border-slate-200 rounded-md p-3 text-center font-bold" />
                <input type="text" defaultValue="None" className="bg-white border border-slate-200 rounded-md p-3 text-center text-slate-400" />
              </div>

              {/* Left Eye (OS) */}
              <div className="grid grid-cols-6 gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex flex-col items-center">
                  <div className="bg-teal-600 text-white text-xs font-bold w-10 h-10 rounded-lg flex items-center justify-center mb-1">OS</div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase">Mắt Trái</span>
                </div>
                <input type="text" defaultValue="-2.25" className="bg-white border border-slate-200 rounded-md p-3 text-center font-bold" />
                <input type="text" defaultValue="-1.00" className="bg-white border border-slate-200 rounded-md p-3 text-center font-bold" />
                <input type="text" defaultValue="010" className="bg-white border border-slate-200 rounded-md p-3 text-center font-bold" />
                <input type="text" defaultValue="+2.25" className="bg-white border border-slate-200 rounded-md p-3 text-center font-bold" />
                <input type="text" defaultValue="None" className="bg-white border border-slate-200 rounded-md p-3 text-center text-slate-400" />
              </div>
            </div>

            {/* Bottom Fields */}
            <div className="grid grid-cols-12 gap-8 mt-8">
              <div className="col-span-6">
                <h4 className="text-sm font-bold mb-4">khoảng cách đồng tử (PD)</h4>
                <div className="flex gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">Khoảng cách đồng từ đơn nhãn (R/L)</span>
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue="31.5" className="w-full bg-white border border-slate-200 rounded p-2 text-center font-bold" />
                      <span>/</span>
                      <input type="text" defaultValue="32.0" className="w-full bg-white border border-slate-200 rounded p-2 text-center font-bold" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">khoảng cách đồng tử hai mắt</span>
                    <input type="text" defaultValue="63.5" className="w-full bg-white border border-teal-500 ring-1 ring-teal-500 rounded p-2 text-center font-bold text-teal-700 text-lg" />
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <h4 className="text-sm font-bold mb-4">Quan sát lâm sàng</h4>
                <textarea 
                  placeholder="Nhập ghi chú lâm sàng cho nhóm vận hành..." 
                  className="w-full h-24 bg-slate-100 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-teal-500 resize-none border-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-teal-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="text-sm font-bold">OCR: 98%</div>
                <div className="text-[10px] text-slate-400">Đã được xác thực dựa trên cơ sở dữ liệu VisionLink.</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-md">
                <ShieldAlert size={18} /> Void Order
              </button>
              <button className="flex items-center gap-2 bg-slate-200 text-slate-700 font-bold text-sm px-6 py-2 rounded-md hover:bg-slate-300">
                <PauseCircle size={18} /> Hold for Review
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;