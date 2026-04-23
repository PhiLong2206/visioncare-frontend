import { useState, useEffect } from "react";
import { 
  Users, Search, Filter, MoreVertical, Shield, 
  Lock, Unlock, Key, Trash2, UserPlus, Mail,
  ChevronRight, X, ShieldCheck, AlertCircle, RefreshCw
} from "lucide-react";
import { getAllUsers, toggleUserStatus, resetPassword, getRoles, changeUserRole, createUser } from "../../api/adminAPI";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(null); // stores user object
  const [showResetModal, setShowResetModal] = useState(null); // stores user object
  
  const [newUser, setNewUser] = useState({ fullName: "", email: "", passwordHash: "", roleId: 5 });
  const [newPassword, setNewPassword] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    action: () => {},
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, roleData] = await Promise.all([getAllUsers(), getRoles()]);
      setUsers(userData);
      setRoles(roleData);
    } catch {
      toast.error("Không thể tải dữ liệu người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (user) => {
    const actionText = user.isActive ? "khóa" : "mở khóa";
    setConfirmModal({
      isOpen: true,
      title: `${user.isActive ? "Khóa" : "Mở khóa"} tài khoản`,
      message: `Bạn có chắc chắn muốn ${actionText} tài khoản của ${user.fullName}?`,
      confirmText: "Xác nhận",
      action: async () => {
        try {
          await toggleUserStatus(user.userId);
          toast.success(`Đã ${actionText} tài khoản thành công`);
          fetchData();
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      toast.success("Đã tạo tài khoản mới thành công");
      setShowCreateModal(false);
      setNewUser({ fullName: "", email: "", passwordHash: "", roleId: 5 });
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChangeRole = async (userId, roleId) => {
    try {
      await changeUserRole(userId, roleId);
      toast.success("Đã thay đổi vai trò người dùng");
      setShowRoleModal(null);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(showResetModal.userId, newPassword);
      toast.success(`Đã đổi mật khẩu cho ${showResetModal.fullName}`);
      setShowResetModal(null);
      setNewPassword("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Quản lý tài khoản</h1>
          <p className="mt-1 text-[16px] text-slate-500">Quản lý danh sách người dùng và phân cấp quyền truy cập hệ thống</p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
        >
          <UserPlus size={18} />
          <span>Thêm người dùng mới</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
              <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Người dùng</th>
              <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Vai trò</th>
              <th className="px-6 py-5 text-[13px] font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
              <th className="px-6 py-5 text-right text-[13px] font-bold uppercase tracking-wider text-slate-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <tr key={user.userId} className="group transition hover:bg-slate-50/80">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{user.fullName}</h4>
                      <p className="text-[13px] text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      {user.roleName}
                    </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                    <span className={`text-[13px] font-medium ${user.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                      {user.isActive ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      title="Reset mật khẩu"
                      onClick={() => setShowResetModal(user)}
                      className="p-2.5 rounded-xl text-slate-400 hover:bg-cyan-50 hover:text-cyan-600 transition"
                    >
                      <Key size={18} />
                    </button>
                    <button 
                      title="Đổi vai trò"
                      onClick={() => setShowRoleModal(user)}
                      className="p-2.5 rounded-xl text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition"
                    >
                      <Shield size={18} />
                    </button>
                    <button 
                      title={user.isActive ? "Khóa tài khoản" : "Mở khóa"}
                      onClick={() => handleToggleStatus(user)}
                      className={`p-2.5 rounded-xl transition ${user.isActive ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}
                    >
                      {user.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-[32px] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Thêm người dùng mới</h2>
                    <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-slate-600 transition">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-600 ml-1">Họ và tên</label>
                        <input 
                            type="text"
                            placeholder="Ví dụ: Nguyễn Văn A"
                            value={newUser.fullName}
                            onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-600 ml-1">Email</label>
                        <input 
                            type="email"
                            placeholder="email@visioncare.com"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-600 ml-1">Mật khẩu</label>
                        <input 
                            type="password"
                            placeholder="••••••••"
                            value={newUser.passwordHash}
                            onChange={(e) => setNewUser({...newUser, passwordHash: e.target.value})}
                            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-600 ml-1">Vai trò mặc định</label>
                        <select 
                            value={newUser.roleId}
                            onChange={(e) => setNewUser({...newUser, roleId: parseInt(e.target.value)})}
                            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 text-sm outline-none transition focus:border-cyan-500 focus:bg-white appearance-none"
                        >
                            {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-10 flex gap-4">
                    <button 
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 h-14 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handleCreateUser}
                        className="flex-1 h-14 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-xl shadow-slate-900/20"
                    >
                        Tạo tài khoản
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-[32px] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-amber-600">
                    <Shield size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Thay đổi vai trò</h2>
                <p className="text-slate-500 mb-8">Bạn đang thay đổi quyền truy cập cho <span className="font-bold text-slate-900">{showRoleModal.fullName}</span></p>
                
                <div className="space-y-3">
                    {roles.map((role) => (
                        <button
                            key={role.roleId}
                            onClick={() => handleChangeRole(showRoleModal.userId, role.roleId)}
                            className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                                showRoleModal.roleName === role.roleName 
                                ? "border-amber-500 bg-amber-50/50" 
                                : "border-slate-100 hover:border-slate-200"
                            }`}
                        >
                            <span className="font-bold text-slate-700">{role.roleName}</span>
                            {showRoleModal.roleName === role.roleName && <CheckCircle2 size={20} className="text-amber-600" />}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => setShowRoleModal(null)}
                    className="mt-8 w-full h-12 text-slate-400 font-bold hover:text-slate-600 transition"
                >
                    Hủy bỏ
                </button>
            </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-[32px] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-600">
                    <Key size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Đặt lại mật khẩu</h2>
                <p className="text-slate-500 mb-8">Nhập mật khẩu mới cho tài khoản <span className="font-bold text-slate-900">{showResetModal.email}</span></p>
                
                <div className="space-y-4">
                    <input 
                        type="password"
                        autoFocus
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-14 w-full rounded-2xl border border-slate-200 px-5 text-sm outline-none transition focus:border-cyan-500"
                    />
                </div>

                <div className="mt-8 flex gap-3">
                    <button 
                        onClick={() => setShowResetModal(null)}
                        className="flex-1 h-13 bg-slate-100 text-slate-600 font-bold rounded-xl"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handleResetPassword}
                        className="flex-1 h-13 bg-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          setConfirmModal({ ...confirmModal, isOpen: false });
          confirmModal.action();
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />
    </section>
  );
}

// Internal component for Check icon used in Role Modal
function CheckCircle2({ size, className }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}