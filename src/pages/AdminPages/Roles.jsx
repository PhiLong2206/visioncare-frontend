import { Check, X, Shield, Lock, Users, Briefcase, Eye, Save } from "lucide-react";

const rolePermissions = [
  {
    role: "Admin",
    desc: "Toàn quyền quản trị hệ thống",
    icon: Shield,
    color: "rose",
    permissions: { view: true, create: true, update: true, delete: true, approve: true, export: true },
  },
  {
    role: "Manager",
    desc: "Quản lý nhân sự và báo cáo",
    icon: Briefcase,
    color: "indigo",
    permissions: { view: true, create: true, update: true, delete: false, approve: true, export: true },
  },
  {
    role: "Sales",
    desc: "Tư vấn khách hàng và chốt đơn",
    icon: Users,
    color: "amber",
    permissions: { view: true, create: true, update: true, delete: false, approve: false, export: false },
  },
  {
    role: "Operations",
    desc: "Quản lý kho và vận chuyển",
    icon: Lock,
    color: "cyan",
    permissions: { view: true, create: false, update: true, delete: false, approve: true, export: false },
  },
];

function PermissionBadge({ active }) {
  return (
    <div className="flex justify-center">
      {active ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 border border-green-200/50 shadow-sm transition-transform hover:scale-110">
          <Check size={18} strokeWidth={3} />
        </div>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100/50 text-slate-300 border border-slate-200/30">
          <X size={18} strokeWidth={2} />
        </div>
      )}
    </div>
  );
}

export default function Roles() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
            Phân quyền & Nhóm quyền
          </h1>
          <p className="mt-1 text-[16px] text-slate-500">
            Phân cấp chi tiết quyền Read/Write/Delete/Approve cho từng vị trí
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg transition hover:bg-slate-800">
          <Save size={18} />
          <span>Lưu ma trận quyền</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
        {rolePermissions.map((item) => (
            <div key={item.role} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-${item.color}-50 text-${item.color}-600`}>
                    <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.role}</h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                <th className="px-8 py-6 text-[13px] font-bold uppercase tracking-wider text-slate-400">Chức năng \ Vai trò</th>
                <th className="px-6 py-6 text-center text-[13px] font-bold uppercase tracking-wider text-slate-400">Xem (R)</th>
                <th className="px-6 py-6 text-center text-[13px] font-bold uppercase tracking-wider text-slate-400">Tạo (W)</th>
                <th className="px-6 py-6 text-center text-[13px] font-bold uppercase tracking-wider text-slate-400">Sửa (W)</th>
                <th className="px-6 py-6 text-center text-[13px] font-bold uppercase tracking-wider text-slate-400">Xóa (D)</th>
                <th className="px-6 py-6 text-center text-[13px] font-bold uppercase tracking-wider text-slate-400">Duyệt (A)</th>
                <th className="px-6 py-6 text-center text-[13px] font-bold uppercase tracking-wider text-slate-400">Xuất (E)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {rolePermissions.map((item) => (
                <tr key={item.role} className="group transition hover:bg-slate-50/80">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full bg-${item.color}-500 shadow-[0_0_8px_rgba(var(--tw-color-${item.color}-500),0.4)]`} />
                        <span className="text-[16px] font-bold text-slate-900">
                          {item.role}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-6"><PermissionBadge active={item.permissions.view} /></td>
                  <td className="px-6 py-6"><PermissionBadge active={item.permissions.create} /></td>
                  <td className="px-6 py-6"><PermissionBadge active={item.permissions.update} /></td>
                  <td className="px-6 py-6"><PermissionBadge active={item.permissions.delete} /></td>
                  <td className="px-6 py-6"><PermissionBadge active={item.permissions.approve} /></td>
                  <td className="px-6 py-6"><PermissionBadge active={item.permissions.export} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-indigo-900 p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Eye size={24} className="text-indigo-300" />
                Audit Logs Integration
            </h3>
            <p className="mt-2 text-indigo-100 max-w-2xl leading-relaxed">
                Mọi thao tác thay đổi quyền hạn sẽ được ghi lại trong hệ thống Audit Logs để phục vụ công tác giám sát và bảo mật thông tin.
            </p>
        </div>
        <Shield size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
      </div>
    </section>
  );
}