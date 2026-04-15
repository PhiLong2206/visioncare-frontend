import { useState } from "react";
import {
  Download,
  UserPlus,
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  FileText,
  Receipt,
  Settings2,
} from "lucide-react";

// --- Types ---
type StatusType = "ACTIVE" | "AWAY" | "RESTRICTED";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: StatusType;
  lastLogin: string;
  avatar: string;
  avatarBg: string;
}

// --- Data ---
const staffList: StaffMember[] = [
  {
    id: 1,
    name: "Dr. Elena Rodriguez",
    email: "elena.r@visioncare.com",
    role: "Manager",
    status: "ACTIVE",
    lastLogin: "2h ago",
    avatar: "ER",
    avatarBg: "bg-teal-200 text-teal-800",
  },
  {
    id: 2,
    name: "Marcus Chen",
    email: "m.chen@visioncare.com",
    role: "Support",
    status: "ACTIVE",
    lastLogin: "1d ago",
    avatar: "MC",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    email: "s.jenkins@visioncare.com",
    role: "Support",
    status: "AWAY",
    lastLogin: "3h ago",
    avatar: "SJ",
    avatarBg: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "j.wilson@visioncare.com",
    role: "Ops",
    status: "RESTRICTED",
    lastLogin: "Never",
    avatar: "JW",
    avatarBg: "bg-slate-200 text-slate-600",
  },
];

const statusStyles: Record<StatusType, string> = {
  ACTIVE: "bg-teal-500 text-white",
  AWAY: "bg-amber-400 text-white",
  RESTRICTED: "bg-rose-500 text-white",
};

const roleColors: Record<string, string> = {
  Manager: "text-teal-600",
  Support: "text-purple-500",
  Ops: "text-slate-500",
};

// Permission matrix rows
const permissionRows = [
  { icon: FileText, label: "Patient Records", perms: ["M", "O", "S"] },
  { icon: Receipt, label: "Billing & Quotes", perms: ["M", "S", "O"] },
  { icon: Settings2, label: "System Config", perms: ["M", "O", "S"] },
];

const permColors: Record<string, string> = {
  M: "bg-teal-600 text-white",
  S: "bg-blue-500 text-white",
  O: "bg-slate-200 text-slate-500",
};

// --- Sub-components ---

function Avatar({ initials, bg }: { initials: string; bg: string }) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${bg}`}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: StatusType }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function StaffRow({ member }: { member: StaffMember }) {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-2 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg px-1 transition group">
      {/* Staff member */}
      <div className="flex items-center gap-2.5">
        <Avatar initials={member.avatar} bg={member.avatarBg} />
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{member.name}</p>
          <p className="text-[11px] text-slate-400">{member.email}</p>
        </div>
      </div>
      {/* Role */}
      <span className={`text-sm font-bold ${roleColors[member.role] ?? "text-slate-600"}`}>
        {member.role}
      </span>
      {/* Status */}
      <div>
        <StatusBadge status={member.status} />
      </div>
      {/* Last login */}
      <span className="text-xs text-slate-400">{member.lastLogin}</span>
      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button className="text-[10px] font-bold text-teal-600 hover:underline">Edit</button>
        <button className="text-[10px] font-bold text-rose-400 hover:underline">Revoke</button>
      </div>
    </div>
  );
}

function PermissionRow({
  icon: Icon,
  label,
  perms,
}: (typeof permissionRows)[0]) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon size={13} className="text-slate-500" />
        </div>
        <span className="text-xs font-bold text-slate-700">{label}</span>
      </div>
      <div className="flex gap-1.5">
        {perms.map((p, i) => (
          <span
            key={i}
            className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-extrabold ${permColors[p]}`}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Main ---
export default function Team() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="flex overflow-y-auto bg-slate-50 font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Staff &amp; Access Control
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-sm leading-relaxed">
              Manage clinical personnel, audit system access, and configure
              granular permissions across all operational departments.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition shadow-md">
              <UserPlus size={14} />
              Onboard Staff
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5">

          {/* Left Column */}
          <div className="flex flex-col gap-4">

            {/* Active Personnel */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wide">
                  Active Personnel
                </h2>
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition border border-slate-200 rounded-lg px-3 py-1.5"
                >
                  <SlidersHorizontal size={12} />
                  Filter by Role
                </button>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 mb-1 px-1">
                {["Staff Member", "Role", "Status", "Last Login", "Actions"].map((h) => (
                  <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {staffList.map((member) => (
                <StaffRow key={member.id} member={member} />
              ))}
            </div>

            {/* Security Audit Banner */}
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-extrabold text-slate-800">
                  Security Audit: Protocol 4.2
                </p>
                <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                  All staff access is logged with 256-bit encryption.
                  Multi-factor authentication is currently{" "}
                  <strong className="text-slate-700">enabled</strong> for all
                  Manager and Ops roles.
                </p>
              </div>
              <button className="text-xs font-bold text-teal-600 hover:text-teal-700 transition shrink-0 mt-0.5">
                View Policy
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">

            {/* Access Matrix */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <KeyRound size={15} className="text-teal-600" />
                <h2 className="text-sm font-extrabold text-slate-700">
                  Access Matrix
                </h2>
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Functional Permissions
              </p>

              <div className="flex flex-col">
                {permissionRows.map((row) => (
                  <PermissionRow key={row.label} {...row} />
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Quick Legend
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Manager (M)", color: "bg-teal-600" },
                    { label: "Supporter (S)", color: "bg-purple-500" },
                    { label: "Ops (O)", color: "bg-slate-300" },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-[11px] text-slate-500 font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition tracking-wide">
                Configure All Roles
              </button>
            </div>

            {/* Suspicious Activity Alert */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-extrabold text-slate-800">
                    Suspicious Activity
                  </p>
                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                    James Wilson's account was restricted due to 3 failed login
                    attempts from an unknown IP.
                  </p>
                  <button className="mt-2 text-[11px] font-extrabold text-rose-600 hover:text-rose-700 tracking-widest uppercase transition">
                    Investigate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}