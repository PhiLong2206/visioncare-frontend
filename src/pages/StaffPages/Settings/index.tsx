import React, { useState } from 'react';
import { 
  Camera, Sun, Moon, AlignLeft, AlignJustify, 
  Mail, MessageSquare, ClipboardCheck, XCircle, 
  Check, Sparkles 
} from 'lucide-react';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('default');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 text-slate-800">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Cài đặt tài khoản và hệ thống</h1>
        <p className="text-slate-500">Quản lý hồ sơ lâm sàng, luồng thông báo và tùy chọn giao diện của bạn.</p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Profile Settings */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <div className="w-24 h-24 bg-teal-500 rounded-full" />
          </div>
          
          <h2 className="text-xl font-bold mb-1">Cài đặt hồ sơ</h2>
          <p className="text-sm text-slate-400 mb-8">Cập nhật thông tin nhận dạng và giấy tờ tùy thân công khai của bạn.</p>

          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tên đầy đủ</label>
                <input 
                  type="text" 
                  defaultValue="Dr. Sarah Chen" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue="s.chen@clinicalcurator.md" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl p-8 bg-slate-50/30">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="w-16 h-16 bg-slate-300 rounded-lg relative top-4 shadow-inner" />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-2 rounded-lg shadow-lg hover:bg-teal-700 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <span className="font-bold text-xs mb-1">Đổi Avatar</span>
              <span className="text-[10px] text-slate-400 uppercase">JPG hoặc PNG, max 2MB</span>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button className="bg-teal-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-800 transition-all">
              Cập nhật hồ sơ <Check size={18} />
            </button>
          </div>
        </section>

        {/* Right: Portal Display */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-6">Giao Diện Hệ Thống</h2>
            
            {/* Theme Toggle */}
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Chủ đề</label>
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Sun size={16} /> Sáng
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Moon size={16} /> Tối
                </button>
              </div>
            </div>

            {/* Density Toggle */}
            {/* <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Interface Density</label>
              <div className="space-y-2">
                <button 
                  onClick={() => setDensity('default')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${density === 'default' ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <AlignJustify size={18} className={density === 'default' ? 'text-teal-600' : 'text-slate-400'} />
                    <span className="font-bold">Default View</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${density === 'default' ? 'border-teal-500 bg-white' : 'border-slate-200'}`} />
                </button>
                <button 
                  onClick={() => setDensity('compact')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${density === 'compact' ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <AlignLeft size={18} className={density === 'compact' ? 'text-teal-600' : 'text-slate-400'} />
                    <span className="font-bold">Compact View</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${density === 'compact' ? 'border-teal-500 bg-white' : 'border-slate-200'}`} />
                </button>
              </div>
            </div> */}
          </section>
        </div>

        {/* Bottom: Notification Preferences */}
        <section className="col-span-12 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold">Tùy chọn thông báo</h2>
              <p className="text-sm text-slate-400">Bạn có thể kiểm soát cách thức và thời điểm nhận thông báo cập nhật trên cổng thông tin.</p>
            </div>
            <div className="flex gap-4">
              <button className="text-sm font-bold text-slate-400 hover:text-slate-600">Vô hiệu hóa tất cả</button>
              <button className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-lg">Mặc Định</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Cảnh báo qua email', desc: 'Tóm tắt hàng ngày tất cả các đơn đặt hàng chăm sóc thị lực.', icon: <Mail size={18} />, active: true },
              { title: 'Cập nhật qua SMS', desc: 'Cảnh báo khẩn cấp cho các yêu cầu bồi thường ưu tiên cao.', icon: <MessageSquare size={18} />, active: false },
              { title: 'Trạng thái đơn hàng', desc: 'Theo dõi vận chuyển hàng hóa đến phòng thí nghiệm theo thời gian thực.', icon: <ClipboardCheck size={18} />, active: true },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50/30">
                <div className="flex gap-4 items-center">
                  <div className="bg-teal-50 text-teal-600 p-3 rounded-xl">{pref.icon}</div>
                  <div>
                    <div className="font-bold text-sm">{pref.title}</div>
                    <div className="text-[10px] text-slate-400 max-w-[120px]">{pref.desc}</div>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${pref.active ? 'bg-teal-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pref.active ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <footer className="mt-8 pt-8 border-t border-slate-200 flex justify-end items-center">
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-lg text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-all">
            Hủy Thay Đổi
          </button>
          <button className="px-8 py-2 rounded-lg text-white font-bold bg-teal-800 hover:bg-teal-900 shadow-lg shadow-teal-900/20 transition-all">
            Lưu Thay Đổi
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Settings;