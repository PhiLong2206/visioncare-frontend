import { useState } from "react";
import { Save, ShieldCheck, Truck, PackageCheck, Bell } from "lucide-react";

export default function Settings() {
  const [config, setConfig] = useState({
    shippingFee: 30000,
    preorderProcessingDays: 7,
    warrantyMonths: 12,
    maxItemsPerOrder: 10,
    supportEmail: "support@visioncare.vn",
    allowPreOrder: true,
    managerApproveImport: true,
    enableSystemNotification: true,
  });

  const handleChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    alert("Đã lưu cấu hình hệ thống!");
  };

  return (
    <section>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900">
            Cấu hình hệ thống
          </h1>
          <p className="mt-2 text-[16px] text-slate-500">
            Thiết lập các tham số và chức năng vận hành chung của hệ thống
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90"
        >
          <Save size={20} />
          <span>Lưu cấu hình</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Truck className="text-cyan-600" size={22} />
            <h2 className="text-xl font-semibold text-slate-900">
              Cấu hình giao hàng
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phí vận chuyển mặc định (VND)
              </label>
              <input
                type="number"
                value={config.shippingFee}
                onChange={(e) => handleChange("shippingFee", e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Số lượng tối đa mỗi đơn
              </label>
              <input
                type="number"
                value={config.maxItemsPerOrder}
                onChange={(e) =>
                  handleChange("maxItemsPerOrder", e.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <PackageCheck className="text-cyan-600" size={22} />
            <h2 className="text-xl font-semibold text-slate-900">
              Cấu hình pre-order
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Số ngày xử lý pre-order
              </label>
              <input
                type="number"
                value={config.preorderProcessingDays}
                onChange={(e) =>
                  handleChange("preorderProcessingDays", e.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-400"
              />
            </div>

            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
              <span className="font-medium text-slate-700">
                Cho phép đặt trước
              </span>
              <input
                type="checkbox"
                checked={config.allowPreOrder}
                onChange={(e) => handleChange("allowPreOrder", e.target.checked)}
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
              <span className="font-medium text-slate-700">
                Yêu cầu Manager duyệt phiếu nhập
              </span>
              <input
                type="checkbox"
                checked={config.managerApproveImport}
                onChange={(e) =>
                  handleChange("managerApproveImport", e.target.checked)
                }
                className="h-5 w-5"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="text-cyan-600" size={22} />
            <h2 className="text-xl font-semibold text-slate-900">
              Cấu hình bảo hành
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Thời gian bảo hành (tháng)
              </label>
              <input
                type="number"
                value={config.warrantyMonths}
                onChange={(e) =>
                  handleChange("warrantyMonths", e.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Bell className="text-cyan-600" size={22} />
            <h2 className="text-xl font-semibold text-slate-900">
              Cấu hình thông báo
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email hỗ trợ hệ thống
              </label>
              <input
                type="email"
                value={config.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-slate-400"
              />
            </div>

            <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
              <span className="font-medium text-slate-700">
                Bật thông báo hệ thống
              </span>
              <input
                type="checkbox"
                checked={config.enableSystemNotification}
                onChange={(e) =>
                  handleChange("enableSystemNotification", e.target.checked)
                }
                className="h-5 w-5"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}