import { useState } from "react";
import { Lock, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    role: "Khách hàng",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.tran@email.com",
    role: "Khách hàng",
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    name: "Lê Minh Châu",
    email: "chau.le@visioncare.vn",
    role: "Hỗ trợ",
    status: "active",
    createdAt: "2023-06-10",
  },
  {
    id: 4,
    name: "Phạm Đức Dũng",
    email: "dung.pham@visioncare.vn",
    role: "Vận hành",
    status: "active",
    createdAt: "2023-07-15",
  },
  {
    id: 5,
    name: "Hoàng Thị Lan",
    email: "lan.hoang@visioncare.vn",
    role: "Quản lý",
    status: "active",
    createdAt: "2023-01-05",
  },
  {
    id: 6,
    name: "Admin System",
    email: "admin@visioncare.vn",
    role: "Admin",
    status: "active",
    createdAt: "2022-12-01",
  },
  {
    id: 7,
    name: "Võ Thanh Hùng",
    email: "hung.vo@email.com",
    role: "Khách hàng",
    status: "active",
    createdAt: "2024-03-10",
  },
  {
    id: 8,
    name: "Đặng Thu Hương",
    email: "huong.dang@visioncare.vn",
    role: "Hỗ trợ",
    status: "inactive",
    createdAt: "2023-08-20",
  },
  {
    id: 9,
    name: "Trương Minh Khoa",
    email: "khoa.truong@email.com",
    role: "Khách hàng",
    status: "active",
    createdAt: "2024-04-01",
  },
  {
    id: 10,
    name: "Ngô Quỳnh Anh",
    email: "anh.ngo@email.com",
    role: "Khách hàng",
    status: "active",
    createdAt: "2024-04-03",
  },
  {
    id: 11,
    name: "Phan Gia Bảo",
    email: "bao.phan@visioncare.vn",
    role: "Vận hành",
    status: "active",
    createdAt: "2023-11-09",
  },
  {
    id: 12,
    name: "Bùi Mỹ Linh",
    email: "linh.bui@email.com",
    role: "Khách hàng",
    status: "inactive",
    createdAt: "2024-04-08",
  },
];

function getRoleClass(role) {
  switch (role) {
    case "Admin":
      return "border border-cyan-200 bg-cyan-50 text-cyan-700";
    case "Quản lý":
      return "border border-violet-200 bg-violet-50 text-violet-700";
    case "Vận hành":
      return "border border-sky-200 bg-sky-50 text-sky-700";
    case "Hỗ trợ":
      return "border border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border border-slate-200 bg-white text-slate-700";
  }
}

function getStatusClass(status) {
  if (status === "active") {
    return "border border-green-200 bg-green-50 text-green-600";
  }
  return "border border-red-200 bg-red-50 text-red-600";
}

export default function Accounts() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900">
            Quản lý tài khoản
          </h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Tạo, chỉnh sửa và quản lý tài khoản người dùng
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-7 py-4 text-[15px] font-semibold text-white shadow-sm transition hover:opacity-90">
          <Plus size={20} />
          <span>Tạo tài khoản</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Tên
                </th>
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Email
                </th>
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Vai trò
                </th>
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Trạng thái
                </th>
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Ngày tạo
                </th>
                <th className="px-7 py-6 text-right text-[15px] font-semibold text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/60"
                >
                  <td className="px-7 py-7 text-[16px] font-semibold text-slate-900">
                    {user.name}
                  </td>

                  <td className="px-7 py-7 text-[16px] text-slate-500">
                    {user.email}
                  </td>

                  <td className="px-7 py-7">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-[14px] font-semibold ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-7 py-7">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-[14px] font-semibold ${getStatusClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-7 py-7 text-[16px] text-slate-500">
                    {user.createdAt}
                  </td>

                  <td className="px-7 py-7">
                    <div className="flex items-center justify-end gap-4">
                      <button className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100">
                        <Pencil size={20} />
                      </button>

                      <button className="rounded-xl p-2 text-red-500 transition hover:bg-red-50">
                        <Lock size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, users.length)} of {users.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}