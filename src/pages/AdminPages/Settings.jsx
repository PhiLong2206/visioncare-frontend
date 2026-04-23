import { useState, useEffect } from "react";
import { Save, Globe, Clock, DollarSign, Image as ImageIcon, Mail, Phone, MapPin } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "../../api/systemSettingsAPI";
import toast from "react-hot-toast";

export default function Settings() {
  const [config, setConfig] = useState({
    SiteName: "VisionCare - Hệ thống bán lẻ kính mắt",
    SiteDescription: "Nền tảng thương mại điện tử chuyên cung cấp các giải pháp thị lực toàn diện.",
    Currency: "VND",
    Timezone: "(UTC+07:00) Bangkok, Hanoi, Jakarta",
    SupportEmail: "contact@visioncare.vn",
    SupportPhone: "1900 1234",
    Address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    LogoUrl: "https://visioncare.vn/logo.png"
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const data = await getSystemSettings();
            const generalData = {};
            data.forEach(s => {
                if (config.hasOwnProperty(s.settingKey)) {
                    generalData[s.settingKey] = s.settingValue;
                }
            });
            if (Object.keys(generalData).length > 0) {
                setConfig(prev => ({ ...prev, ...generalData }));
            }
        } catch (error) {
            console.error("Fetch general settings failed:", error);
        }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
        setIsSaving(true);
        await updateSystemSettings(config);
        toast.success("Đã cập nhật cấu hình chung thành công!");
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
            Cấu hình chung
          </h1>
          <p className="mt-1 text-[16px] text-slate-500">
            Quản lý thông tin thương hiệu, định dạng vùng và liên hệ hệ thống
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[15px] font-bold text-white shadow-lg transition hover:bg-slate-800"
        >
          <Save size={18} />
          <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Website Identity */}
        <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <Globe size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Thông tin Website</h2>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Tên Website</label>
                            <input
                                type="text"
                                value={config.SiteName}
                                onChange={(e) => handleChange("SiteName", e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Khẩu hiệu / Mô tả ngắn</label>
                            <input
                                type="text"
                                value={config.SiteDescription}
                                onChange={(e) => handleChange("SiteDescription", e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Logo URL</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={config.LogoUrl}
                                onChange={(e) => handleChange("LogoUrl", e.target.value)}
                                className="h-12 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-cyan-500"
                            />
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200">
                                <ImageIcon size={20} className="text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Regional Settings */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Clock size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Vùng & Đơn vị</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Múi giờ hệ thống</label>
                        <select 
                            value={config.Timezone}
                            onChange={(e) => handleChange("Timezone", e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500"
                        >
                            <option>{config.Timezone}</option>
                            <option>(UTC+08:00) Beijing, Hong Kong</option>
                            <option>(UTC+09:00) Tokyo, Seoul</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Định dạng tiền tệ</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select 
                                value={config.Currency}
                                onChange={(e) => handleChange("Currency", e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500"
                            >
                                <option>VND (₫)</option>
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                        <Phone size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Liên hệ</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Hỗ trợ</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={config.SupportEmail}
                                onChange={(e) => handleChange("SupportEmail", e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-rose-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Hotline</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={config.SupportPhone}
                                onChange={(e) => handleChange("SupportPhone", e.target.value)}
                                className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-rose-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Địa chỉ trụ sở</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <textarea
                                rows={3}
                                value={config.Address}
                                onChange={(e) => handleChange("Address", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-rose-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}