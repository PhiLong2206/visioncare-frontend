import { Check } from "lucide-react";

const rolePermissions = [
  {
    role: "Admin",
    permissions: {
      view: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
    },
  },
  {
    role: "Quản lý",
    permissions: {
      view: true,
      create: false,
      update: true,
      delete: false,
      approve: true,
    },
  },
  {
    role: "Vận hành",
    permissions: {
      view: true,
      create: true,
      update: true,
      delete: false,
      approve: false,
    },
  },
  {
    role: "Hỗ trợ",
    permissions: {
      view: true,
      create: false,
      update: true,
      delete: false,
      approve: false,
    },
  },
  {
    role: "Khách hàng",
    permissions: {
      view: true,
      create: true,
      update: false,
      delete: false,
      approve: false,
    },
  },
];

function PermissionCell({ active }) {
  return (
    <div className="flex justify-center">
      {active ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600">
          <Check size={16} />
        </span>
      ) : (
        <span className="h-8 w-8 rounded-full bg-slate-100" />
      )}
    </div>
  );
}

export default function Roles() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-slate-900">
          Vai trò & Quyền
        </h1>
        <p className="mt-2 text-[16px] text-slate-500">
          Thiết lập quyền truy cập và thao tác cho từng vai trò người dùng
        </p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[18px] text-slate-500">
                <th className="px-6 py-5 font-medium">Vai trò</th>
                <th className="px-6 py-5 text-center font-medium">Xem</th>
                <th className="px-6 py-5 text-center font-medium">Tạo</th>
                <th className="px-6 py-5 text-center font-medium">Sửa</th>
                <th className="px-6 py-5 text-center font-medium">Xóa</th>
                <th className="px-6 py-5 text-center font-medium">Duyệt</th>
              </tr>
            </thead>

            <tbody>
              {rolePermissions.map((item) => (
                <tr
                  key={item.role}
                  className="border-b border-slate-100 text-[17px] last:border-b-0"
                >
                  <td className="px-6 py-6 font-semibold text-slate-900">
                    {item.role}
                  </td>
                  <td className="px-6 py-6">
                    <PermissionCell active={item.permissions.view} />
                  </td>
                  <td className="px-6 py-6">
                    <PermissionCell active={item.permissions.create} />
                  </td>
                  <td className="px-6 py-6">
                    <PermissionCell active={item.permissions.update} />
                  </td>
                  <td className="px-6 py-6">
                    <PermissionCell active={item.permissions.delete} />
                  </td>
                  <td className="px-6 py-6">
                    <PermissionCell active={item.permissions.approve} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}