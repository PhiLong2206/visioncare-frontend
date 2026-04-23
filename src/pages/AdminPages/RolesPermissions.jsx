import { useState, useEffect } from "react";
import { Shield, Key, CheckCircle2, Trash2, Plus, ChevronRight, Lock, Users, X, Save, ShieldAlert, RefreshCw } from "lucide-react";
import { getRoles, createRole, deleteRole, updateRolePermissions, initPermissions } from "../../api/adminAPI";
import { getSystemSettings } from "../../api/systemSettingsAPI";
import toast from "react-hot-toast";

const PERMISSION_MODULES = [
  { id: "SYSTEM_CONFIG", label: "Cấu hình hệ thống", description: "Cài đặt chung, giao vận, website" },
  { id: "USER_MANAGEMENT", label: "Quản lý tài khoản", description: "Xem, khóa, đổi role người dùng" },
  { id: "ORDER_MANAGEMENT", label: "Quản lý đơn hàng", description: "Xử lý đơn, giao hàng, hoàn tiền" },
  { id: "PRODUCT_MANAGEMENT", label: "Quản lý sản phẩm", description: "Thêm/sửa sản phẩm, tồn kho" },
  { id: "FINANCE_STATS", label: "Tài chính & Thống kê", description: "Xem doanh thu, báo cáo lợi nhuận" },
];

export default function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [rolePerms, setRolePerms] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roleData, settings] = await Promise.all([getRoles(), getSystemSettings()]);
      console.log("DEBUG - Roles:", roleData);
      console.log("DEBUG - Settings:", settings);
      setRoles(roleData);
      
      const perms = {};
      settings.forEach(s => {
          const rawKey = s.settingKey || s.SettingKey || "";
          const key = rawKey.toLowerCase();
          
          if (key.startsWith("roleperms_")) {
              const rId = key.split("_")[1];
              const value = s.settingValue || s.SettingValue || "";
              perms[rId] = value ? value.split(",").filter(p => p) : [];
          }
      });
      setRolePerms(perms);
      
      if (roleData.length > 0 && !activeRole) {
          setActiveRole(roleData[0]);
      }
    } catch (error) {
      console.error("Perms fetch error:", error);
      toast.error("Không thể tải danh sách quyền");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTogglePermission = (moduleId) => {
    if (!activeRole) return;
    
    const currentPerms = rolePerms[activeRole.roleId] || [];
    const newPerms = currentPerms.includes(moduleId)
      ? currentPerms.filter(id => id !== moduleId)
      : [...currentPerms, moduleId];
      
    setRolePerms({
      ...rolePerms,
      [activeRole.roleId]: newPerms
    });
  };

  const handleSavePermissions = async () => {
    if (!activeRole) return;
    try {
      setSaving(true);
      await updateRolePermissions(activeRole.roleId, rolePerms[activeRole.roleId] || []);
      toast.success(`Đã cập nhật quyền cho nhóm ${activeRole.roleName}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInitDefaults = async () => {
    try {
      setSaving(true);
      await initPermissions();
      toast.success("Đã khôi phục quyền mặc định hệ thống");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await createRole(newRoleName);
      toast.success("Đã tạo vai trò mới");
      setNewRoleName("");
      setShowNewRoleModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vai trò này?")) return;
    try {
      await deleteRole(id);
      toast.success("Đã xóa vai trò");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Phân quyền hệ thống</h1>
          <p className="mt-1 text-[16px] text-slate-500">Thiết lập chi tiết quyền hạn thao tác cho từng nhóm đối tượng</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleInitDefaults}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-[14px] font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={18} className={saving ? "animate-spin" : ""} />
            <span>Khôi phục mặc định</span>
          </button>
          
          <button 
            onClick={() => setShowNewRoleModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
          >
            <Plus size={18} />
            <span>Tạo vai trò mới</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Role List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 px-2 text-[13px] font-bold uppercase tracking-wider text-slate-400">
            <Users size={14} />
            VAI TRÒ NGƯỜI DÙNG
          </div>
          
          <div className="space-y-3">
            {roles.map((role) => (
              <button
                key={role.roleId}
                onClick={() => setActiveRole(role)}
                className={`group relative flex w-full items-center gap-4 rounded-[24px] border-2 p-5 transition-all duration-300 ${
                  activeRole?.roleId === role.roleId
                    ? "border-cyan-500 bg-white shadow-xl shadow-cyan-500/10 ring-4 ring-cyan-500/5"
                    : "border-transparent bg-slate-50 hover:bg-white hover:border-slate-200"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold transition-colors ${
                  activeRole?.roleId === role.roleId ? "bg-cyan-500 text-white" : "bg-slate-200 text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-600"
                }`}>
                  {role.roleName.charAt(0)}
                </div>
                
                <div className="flex-1 text-left">
                  <h4 className={`font-bold transition-colors ${activeRole?.roleId === role.roleId ? "text-slate-900" : "text-slate-600"}`}>
                    {role.roleName}
                  </h4>
                  <p className="text-[12px] text-slate-400">
                    #{role.roleId} • {(rolePerms[role.roleId] || []).length} quyền
                  </p>
                </div>

                <ChevronRight size={18} className={`transition-transform duration-300 ${activeRole?.roleId === role.roleId ? "translate-x-1 text-cyan-500" : "text-slate-300"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Permission Matrix */}
        <div className="lg:col-span-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Ma trận quyền: <span className="text-cyan-600">{activeRole?.roleName}</span></h3>
                  <p className="text-[14px] text-slate-500">Tích chọn để cấp quyền cho vai trò này</p>
                </div>
              </div>

              <button 
                onClick={handleSavePermissions}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-6 py-4 text-[14px] font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700 disabled:opacity-50"
              >
                {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={18} />}
                <span>Lưu thay đổi</span>
              </button>
            </div>

            <div className="space-y-3">
              {PERMISSION_MODULES.map((module) => {
                const isChecked = (rolePerms[activeRole?.roleId] || []).includes(module.id);
                return (
                  <label
                    key={module.id}
                    className={`flex cursor-pointer items-center justify-between rounded-[24px] border-2 px-6 py-5 transition-all duration-200 ${
                      isChecked ? "border-cyan-100 bg-cyan-50/30" : "border-slate-50 bg-slate-50/50 hover:border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isChecked ? "bg-cyan-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className={`font-bold ${isChecked ? "text-slate-900" : "text-slate-600"}`}>{module.label}</p>
                        <p className="text-[12px] text-slate-400">{module.description}</p>
                      </div>
                    </div>
                    
                    <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                        <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={isChecked}
                            onChange={() => handleTogglePermission(module.id)}
                        />
                        <div className={`h-6 w-11 rounded-full transition-colors ${isChecked ? "bg-cyan-600" : "bg-slate-200"}`} />
                        <div className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isChecked ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl bg-amber-50 p-6 border border-amber-100 flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <h5 className="font-bold text-amber-900">Lưu ý về Phân quyền</h5>
                    <p className="mt-1 text-[13px] text-amber-700 leading-relaxed">
                        Mọi thay đổi về quyền hạn sẽ có hiệu lực ngay lập tức. Nhân viên thuộc vai trò này sẽ bị giới hạn hoặc được mở rộng các tính năng tương ứng trên thanh Sidebar và các nút hành động.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Role Modal */}
      {showNewRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Tạo vai trò mới</h2>
                    <button onClick={() => setShowNewRoleModal(false)} className="p-2 text-slate-400 hover:text-slate-600 transition">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[13px] font-bold text-slate-700 mb-2 block">Tên vai trò</label>
                        <input 
                            type="text"
                            placeholder="Ví dụ: Nhân viên kỹ thuật"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-cyan-500"
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button 
                        onClick={() => setShowNewRoleModal(false)}
                        className="flex-1 h-12 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handleCreateRole}
                        className="flex-1 h-12 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
      )}
    </section>
  );
}
