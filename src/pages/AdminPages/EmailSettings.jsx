import { useState, useEffect } from "react";
import { Mail, Shield, Server, Send, Save, CheckCircle, AlertCircle } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "../../api/systemSettingsAPI";
import toast from "react-hot-toast";

export default function EmailSettings() {
  const [settings, setSettings] = useState({
    SmtpServer: "smtp.visioncare.vn",
    SmtpPort: "587",
    SupportEmail: "no-reply@visioncare.vn",
    EmailPassword: "",
    UseSsl: "true",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const data = await getSystemSettings();
            const emailData = {};
            data.forEach(s => {
                if (settings.hasOwnProperty(s.settingKey)) {
                    emailData[s.settingKey] = s.settingValue;
                }
            });
            if (Object.keys(emailData).length > 0) {
                setSettings(prev => ({ ...prev, ...emailData }));
            }
        } catch (error) {
            console.error("Fetch email settings failed:", error);
        }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
        setIsSaving(true);
        await updateSystemSettings(settings);
        toast.success("Đã cập nhật cấu hình Email thành công!");
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
            Email & Thông báo
          </h1>
          <p className="mt-1 text-[16px] text-slate-500">
            Cấu hình SMTP server và mẫu email gửi cho khách hàng
          </p>
        </div>

        <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg transition hover:bg-slate-800"
        >
          <Save size={18} />
          <span>{isSaving ? "Đang lưu..." : "Lưu cấu hình"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
              {/* SMTP Configuration */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Server size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">Cấu hình SMTP</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-semibold text-slate-700">SMTP Server</label>
                          <input 
                            type="text" 
                            value={settings.SmtpServer} 
                            onChange={(e) => handleChange('SmtpServer', e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Port</label>
                          <input 
                            type="text" 
                            value={settings.SmtpPort} 
                            onChange={(e) => handleChange('SmtpPort', e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" 
                          />
                      </div>
                  </div>

                  <div className="mt-6 space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Email người gửi</label>
                      <input 
                        type="email" 
                        value={settings.SupportEmail} 
                        onChange={(e) => handleChange('SupportEmail', e.target.value)}
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" 
                      />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.UseSsl === "true"} 
                            onChange={(e) => handleChange('UseSsl', e.target.checked ? "true" : "false")}
                            className="h-5 w-5 rounded accent-blue-600" 
                          />
                          <span className="text-sm font-medium text-slate-700">Sử dụng SSL/TLS</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={true} readOnly className="h-5 w-5 rounded accent-blue-600" />
                          <span className="text-sm font-medium text-slate-700">Yêu cầu xác thực</span>
                      </label>
                  </div>
              </div>

              {/* Test Connection */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <Send size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">Kiểm tra kết nối</h2>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-6">Nhập email nhận để gửi một email thử nghiệm với cấu hình hiện tại.</p>
                  
                  <div className="flex gap-4">
                      <input 
                        type="email" 
                        placeholder="test-recipient@example.com" 
                        className="h-12 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-amber-500" 
                      />
                      <button className="h-12 px-6 bg-amber-50 text-amber-600 font-bold rounded-xl border border-amber-200 hover:bg-amber-100 transition">
                          Gửi test
                      </button>
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                      <Shield size={20} className="text-blue-400" />
                      Bảo mật SMTP
                  </h3>
                  <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                      Chúng tôi khuyến nghị sử dụng <strong>App Password</strong> nếu bạn dùng Gmail hoặc Outlook để đảm bảo mật khẩu chính của tài khoản không bị lộ.
                  </p>
                  <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                          <CheckCircle size={16} className="text-green-400" />
                          <span>Hỗ trợ OAuth2</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                          <CheckCircle size={16} className="text-green-400" />
                          <span>Mã hóa AES-256</span>
                      </div>
                  </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-blue-50 p-6 flex gap-4">
                  <AlertCircle size={24} className="text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                      Lưu ý: Sau khi đổi cấu hình, hãy thực hiện "Gửi test" để đảm bảo các email thông báo đơn hàng không bị gián đoạn.
                  </p>
              </div>
          </div>
      </div>
    </section>
  );
}
