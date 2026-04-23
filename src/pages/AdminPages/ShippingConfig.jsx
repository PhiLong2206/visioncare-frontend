import { useState, useEffect } from "react";
import { Truck, MapPin, Calculator, Plus, Settings as SettingsIcon, Save } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "../../api/systemSettingsAPI";
import toast from "react-hot-toast";

export default function ShippingConfig() {
  const [carriers, setCarriers] = useState([
    { name: "Giao Hàng Tiết Kiệm", code: "GHTK", status: "Active", api: "v1.2.5" },
    { name: "Giao Hàng Nhanh", code: "GHN", status: "Active", api: "v2.0.0" },
    { name: "Viettel Post", code: "VTP", status: "Inactive", api: "None" },
  ]);

  const [shippingFees, setShippingFees] = useState({
    ShippingInnerCityFee: "25000",
    ShippingOuterCityFee: "35000",
    ShippingFreeThreshold: "2000000",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFees = async () => {
        try {
            const settings = await getSystemSettings();
            const fees = {};
            settings.forEach(s => {
                if (shippingFees.hasOwnProperty(s.settingKey)) {
                    fees[s.settingKey] = s.settingValue;
                }
            });
            if (Object.keys(fees).length > 0) {
                setShippingFees(prev => ({ ...prev, ...fees }));
            }
        } catch (error) {
            console.error("Fetch settings failed:", error);
        }
    };
    fetchFees();
  }, []);

  const handleFeeChange = (key, value) => {
    setShippingFees(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveFees = async () => {
    try {
        setIsSaving(true);
        await updateSystemSettings(shippingFees);
        toast.success("Đã cập nhật bảng giá vận chuyển!");
    } catch (error) {
        toast.error("Cập nhật thất bại!");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
            Cấu hình Giao vận
          </h1>
          <p className="mt-1 text-[16px] text-slate-500">
            Kết nối đơn vị vận chuyển và thiết lập bảng giá ship tự động
          </p>
        </div>

        <button 
          onClick={() => toast.success("Tính năng thêm đối tác mới đang được phát triển!")}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg transition hover:bg-slate-800"
        >
          <Plus size={18} />
          <span>Thêm đối tác</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-2">
                  <Truck size={20} className="text-cyan-600" />
                  Đơn vị vận chuyển
              </h2>
              {carriers.map((carrier) => (
                  <div key={carrier.code} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between transition hover:shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 border border-slate-100">
                              {carrier.code}
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900">{carrier.name}</h3>
                              <p className="text-[12px] text-slate-500">API Version: {carrier.api}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                              carrier.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                              {carrier.status}
                          </span>
                          <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition">
                              <SettingsIcon size={18} />
                          </button>
                      </div>
                  </div>
              ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calculator size={20} className="text-indigo-600" />
                  Tính phí ship tự động
              </h2>
              
              <div className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Phí ship nội tỉnh (Đồng giá)</label>
                      <div className="relative">
                          <input 
                            type="text" 
                            value={shippingFees.ShippingInnerCityFee} 
                            onChange={(e) => handleFeeChange('ShippingInnerCityFee', e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 pl-4 pr-12 text-sm outline-none focus:border-indigo-500" 
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">VND</span>
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Phí ship ngoại tỉnh (Đồng giá)</label>
                      <div className="relative">
                          <input 
                            type="text" 
                            value={shippingFees.ShippingOuterCityFee} 
                            onChange={(e) => handleFeeChange('ShippingOuterCityFee', e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 pl-4 pr-12 text-sm outline-none focus:border-indigo-500" 
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">VND</span>
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Miễn phí vận chuyển cho đơn từ</label>
                      <div className="relative">
                          <input 
                            type="text" 
                            value={shippingFees.ShippingFreeThreshold} 
                            onChange={(e) => handleFeeChange('ShippingFreeThreshold', e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 pl-4 pr-12 text-sm outline-none focus:border-indigo-500" 
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">VND</span>
                      </div>
                  </div>

                  <div className="pt-4">
                    <button 
                        onClick={handleSaveFees}
                        disabled={isSaving}
                        className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl shadow-lg transition hover:bg-slate-800 flex items-center justify-center gap-2"
                    >
                        {isSaving ? "Đang lưu..." : (
                            <>
                                <Save size={18} />
                                <span>Cập nhật bảng giá</span>
                            </>
                        )}
                    </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="mt-10 p-6 rounded-3xl bg-slate-50 border border-slate-200 flex items-center gap-4">
          <MapPin size={24} className="text-rose-500 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Ghi chú:</strong> Hệ thống sẽ tự động ưu tiên chọn đơn vị vận chuyển có phí rẻ nhất dựa trên cân nặng và địa chỉ của khách hàng nếu bạn bật chế độ "Tự động tối ưu phí".
          </p>
      </div>
    </section>
  );
}
