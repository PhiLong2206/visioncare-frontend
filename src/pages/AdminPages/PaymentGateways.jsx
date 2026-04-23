import { useState, useEffect } from "react";
import { CreditCard, Shield, Plus, ExternalLink, Settings2, Save, X, Lock } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "../../api/systemSettingsAPI";
import toast from "react-hot-toast";

export default function PaymentGateways() {
  const [gateways, setGateways] = useState([
    { id: "PayOS", name: "PayOS", status: "Active", type: "Bank Transfer", icon: "https://payos.vn/wp-content/uploads/2023/06/Logo-PayOS-1.png" },
    { id: "VNPay", name: "VNPay", status: "Inactive", type: "E-Wallet / Bank", icon: "https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAY.png" },
    { id: "MoMo", name: "MoMo", status: "Inactive", type: "E-Wallet", icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
  ]);

  const [activeConfig, setActiveConfig] = useState(null);
  const [configValues, setConfigValues] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
        try {
            const data = await getSystemSettings();
            const values = {};
            data.forEach(s => {
                values[s.settingKey] = s.settingValue;
            });
            setConfigValues(values);
        } catch (error) {
            console.error("Fetch payment config failed");
        }
    };
    fetchConfig();
  }, []);

  const handleOpenConfig = (gate) => {
    setActiveConfig(gate);
  };

  const handleSave = async () => {
    try {
        setIsSaving(true);
        await updateSystemSettings(configValues);
        toast.success(`Đã cập nhật cấu hình ${activeConfig.name} thành công!`);
        setActiveConfig(null);
    } catch (error) {
        toast.error("Cập nhật thất bại");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Tích hợp Thanh toán</h1>
          <p className="mt-1 text-[16px] text-slate-500">Quản lý API Keys và cấu hình các cổng thanh toán trực tuyến</p>
        </div>

        <button 
          onClick={() => toast.error("Vui lòng liên hệ nhà phát triển để tích hợp thêm cổng mới")}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg transition hover:bg-slate-800"
        >
          <Plus size={18} />
          <span>Thêm cổng mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {gateways.map((gate) => (
          <div key={gate.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col transition hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-24 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100">
                    <img src={gate.icon} alt={gate.name} className="max-h-full max-w-full object-contain" />
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${
                    gate.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                }`}>
                    {gate.status}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{gate.name}</h3>
            <p className="text-[13px] text-slate-500">{gate.type}</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleOpenConfig(gate)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                    <Settings2 size={16} />
                    <span>Cấu hình</span>
                </button>
                <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
                    <ExternalLink size={16} />
                    <span>Tài liệu</span>
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {activeConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 p-2">
                            <img src={activeConfig.icon} alt="" className="max-h-full max-w-full" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Cấu hình {activeConfig.name}</h2>
                            <p className="text-sm text-slate-500">Thiết lập tham số kết nối API</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveConfig(null)} className="p-2 text-slate-400 hover:text-slate-600 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Client ID / Partner ID</label>
                        <input 
                            type="text" 
                            value={configValues[`${activeConfig.id}_ClientId`] || ""}
                            onChange={(e) => setConfigValues({...configValues, [`${activeConfig.id}_ClientId`]: e.target.value})}
                            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" 
                            placeholder="Nhập Client ID..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">API Key / Secret Key</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="password" 
                                value={configValues[`${activeConfig.id}_ApiKey`] || ""}
                                onChange={(e) => setConfigValues({...configValues, [`${activeConfig.id}_ApiKey`]: e.target.value})}
                                className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-blue-500" 
                                placeholder="••••••••••••••••"
                            />
                        </div>
                    </div>
                    {activeConfig.id === "PayOS" && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Checksum Key (Webhook)</label>
                            <input 
                                type="text" 
                                value={configValues[`${activeConfig.id}_ChecksumKey`] || ""}
                                onChange={(e) => setConfigValues({...configValues, [`${activeConfig.id}_ChecksumKey`]: e.target.value})}
                                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" 
                                placeholder="Nhập Checksum Key..."
                            />
                        </div>
                    )}
                </div>

                <div className="mt-10 flex gap-4">
                    <button onClick={() => setActiveConfig(null)} className="flex-1 h-12 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">
                        Đóng
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-2 h-12 px-10 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        <span>{isSaving ? "Đang lưu..." : "Lưu cấu hình"}</span>
                    </button>
                </div>
            </div>
        </div>
      )}
    </section>
  );
}
