import { useState } from "react";
import { SquarePen } from "lucide-react";

// --- Types ---
type Status = "active" | "inactive";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: Status;
}

// --- Data ---
const initialMembers: Member[] = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nguyen@email.com", phone: "0901234567", role: "Khách hàng", status: "active" },
  { id: 2, name: "Trần Thị Bình", email: "binh.tran@email.com", phone: "0912345678", role: "Khách hàng", status: "active" },
  { id: 3, name: "Lê Minh Châu", email: "chau.le@visioncare.vn", phone: "0923456789", role: "Hỗ trợ", status: "active" },
  { id: 4, name: "Phạm Đức Dũng", email: "dung.pham@visioncare.vn", phone: "0934567890", role: "Vận hành", status: "active" },
  { id: 5, name: "Hoàng Thị Lan", email: "lan.hoang@visioncare.vn", phone: "0945678901", role: "Quản lý", status: "active" },
  { id: 6, name: "Admin System", email: "admin@visioncare.vn", phone: "0956789012", role: "Admin", status: "active" },
  { id: 7, name: "Võ Thanh Hùng", email: "hung.vo@email.com", phone: "0967890123", role: "Khách hàng", status: "active" },
  { id: 8, name: "Đặng Thu Hương", email: "huong.dang@visioncare.vn", phone: "0978901234", role: "Hỗ trợ", status: "inactive" },
];

// --- Edit Modal ---
function EditModal({ member, onSave, onClose }: { member: Member; onSave: (m: Member) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...member });

  const roles = ["Khách hàng", "Hỗ trợ", "Vận hành", "Quản lý", "Admin"];

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-800">Chỉnh sửa thành viên</h3>

        <div className="flex flex-col gap-3">
          {(["name", "email", "phone"] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {field === "name" ? "Tên" : field === "email" ? "Email" : "SĐT"}
              </label>
              <input
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Vai trò</label>
            <select
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              {roles.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Trạng thái</label>
            <div className="flex gap-2">
              {(["active", "inactive"] as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${
                    form.status === s
                      ? s === "active"
                        ? "bg-teal-50 border-teal-400 text-teal-600"
                        : "bg-slate-100 border-slate-300 text-slate-600"
                      : "border-slate-200 text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition">
            Hủy
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main ---
export default function Team() {
  const [members, setMembers] = useState(initialMembers);
  const [editing, setEditing] = useState<Member | null>(null);

  const handleSave = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const cols = "grid-cols-[1.4fr_2fr_1.3fr_1fr_1fr_60px]";

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6">
      <div className="max-w-6xl mx-auto">
        {editing && (
          <EditModal member={editing} onSave={handleSave} onClose={() => setEditing(null)} />
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className={`grid ${cols} gap-4 px-6 py-4 border-b border-slate-100`}>
            {["Tên", "Email", "SĐT", "Vai trò", "Trạng thái", "Thao tác"].map((h) => (
              <span key={h} className="text-sm text-slate-400">{h}</span>
            ))}
          </div>

          {/* Rows */}
          {members.map((member, i) => (
            <div
              key={member.id}
              className={`grid ${cols} gap-4 items-center px-6 py-5 hover:bg-slate-50 transition ${
                i !== members.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              {/* Name */}
              <span className="text-sm font-bold text-slate-800">{member.name}</span>

              {/* Email */}
              <span className="text-sm text-slate-400 truncate">{member.email}</span>

              {/* Phone */}
              <span className="text-sm text-slate-700">{member.phone}</span>

              {/* Role */}
              <span>
                <span className="inline-block text-xs font-semibold text-slate-700 border border-slate-200 rounded-full px-3 py-1 bg-white">
                  {member.role}
                </span>
              </span>

              {/* Status */}
              <span>
                <span
                  className={`inline-block text-xs font-semibold rounded-full px-3 py-1 border transition ${
                    member.status === "active"
                      ? "text-teal-600 border-teal-300 bg-teal-50"
                      : "text-slate-400 border-slate-200 bg-slate-100"
                  }`}
                >
                  {member.status}
                </span>
              </span>

              {/* Action */}
              <div className="flex justify-end">
                <button
                  onClick={() => setEditing(member)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"
                >
                  <SquarePen size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}