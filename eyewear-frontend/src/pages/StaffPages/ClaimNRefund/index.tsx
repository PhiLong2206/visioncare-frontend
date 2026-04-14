import { useState } from "react";
import {
  Filter, User, Printer, History, X, RefreshCw, BadgeDollarSign,
  ChevronRight, AlertTriangle, Clock, ShieldCheck,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ClaimType = "DEFECT CLAIM" | "REFUND" | "EMERGENCY";
type ClaimStatus = "In Review" | "Pending" | "Urgent";
type WarrantyStatus = "Warranty Active" | "Warranty Expired" | "Under Review";

interface Claim {
  id: string;
  type: ClaimType;
  customer: string;
  product: string;
  timeAgo: string;
  status: ClaimStatus;
}

interface ClaimDetail {
  id: string;
  customer: string;
  memberSince: string;
  warrantyStatus: WarrantyStatus;
  issueDescription: string;
  originalProduct: string;
  purchaseDate: string;
  warrantyType: string;
  remainingTerm: string;
  auditLog: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const CLAIMS: Claim[] = [
  { id: "CLM-4902", type: "DEFECT CLAIM", customer: "Sarah J. Miller", product: "Varilux X Series – Lens Peeling", timeAgo: "2h ago", status: "In Review" },
  { id: "CLM-4899", type: "REFUND", customer: "Robert Chen", product: "Frame Fitting Issue – Gucci GG001", timeAgo: "5h ago", status: "Pending" },
  { id: "CLM-4885", type: "EMERGENCY", customer: "Elena Rodriguez", product: "Shattered Lens – High Impact", timeAgo: "1d ago", status: "Urgent" },
];

const CLAIM_DETAILS: Record<string, ClaimDetail> = {
  "CLM-4902": {
    id: "CLM-4902", customer: "Sarah J. Miller", memberSince: "2019",
    warrantyStatus: "Warranty Active",
    issueDescription: '"Patient reports progressive delamination on the outer coating of the left lens (OS). Started as a small pinhole near the nasal area and expanded over 48 hours. No traumatic impact reported. Patient follows recommended cleaning protocols."',
    originalProduct: "Varilux X Design (1.67)", purchaseDate: "Oct 12, 2023",
    warrantyType: "Premium Performance (2yr)", remainingTerm: "14 Months Remaining",
    auditLog: "Claim initiated by Staff (ID: OP-441) at 10:14 AM",
  },
  "CLM-4899": {
    id: "CLM-4899", customer: "Robert Chen", memberSince: "2021",
    warrantyStatus: "Under Review",
    issueDescription: '"Patient reports that the Gucci GG001 frame does not sit level on the face after professional fitting. The left temple appears 3mm shorter causing chronic discomfort. No physical damage visible."',
    originalProduct: "Gucci GG001 Frames", purchaseDate: "Aug 5, 2023",
    warrantyType: "Standard (1yr)", remainingTerm: "4 Months Remaining",
    auditLog: "Claim reviewed by Staff (ID: OP-212) at 09:30 AM",
  },
  "CLM-4885": {
    id: "CLM-4885", customer: "Elena Rodriguez", memberSince: "2020",
    warrantyStatus: "Warranty Expired",
    issueDescription: '"Patient presents with completely shattered right lens (OD) following reported high-impact sports activity. Frame integrity is compromised. Patient requests emergency replacement due to visual impairment."',
    originalProduct: "Nike Flexon Sport (1.74)", purchaseDate: "Mar 18, 2022",
    warrantyType: "Basic Coverage", remainingTerm: "Expired",
    auditLog: "Emergency flag set by Staff (ID: OP-109) at 08:45 AM",
  },
};

// ── Style Maps ────────────────────────────────────────────────────────────────
const CLAIM_TYPE_STYLES: Record<ClaimType, string> = {
  "DEFECT CLAIM": "bg-blue-100 text-blue-700",
  REFUND: "bg-emerald-100 text-emerald-700",
  EMERGENCY: "bg-red-100 text-red-600",
};

const STATUS_STYLES: Record<ClaimStatus, string> = {
  "In Review": "text-teal-600 font-semibold",
  Pending: "text-gray-400",
  Urgent: "text-red-500 font-semibold",
};

const WARRANTY_STYLES: Record<WarrantyStatus, string> = {
  "Warranty Active": "bg-teal-500 text-white",
  "Warranty Expired": "bg-red-500 text-white",
  "Under Review": "bg-amber-400 text-white",
};

const REJECT_REASONS = [
  "No defect found",
  "Outside warranty period",
  "Physical damage by user",
  "Missing documentation",
  "Duplicate claim",
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ClaimsRefunds() {
  const [selectedId, setSelectedId] = useState("CLM-4902");
  const [staffNote, setStaffNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const detail = CLAIM_DETAILS[selectedId];

  const handleAction = (action: string) => {
    setActionMsg(`✓ ${action} submitted for ${selectedId}`);
    setTimeout(() => setActionMsg(null), 3000);
  };

  return (

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Claims &amp; Refunds</h1>
            <p className="text-sm text-gray-400 mt-1">Manage product discrepancies, quality assurance claims, and patient refund requests with clinical precision.</p>
          </div>
          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-400 tracking-widest">ACTIVE CLAIMS</p>
              <p className="text-3xl font-bold text-gray-900 mt-0.5">24</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-400 tracking-widest">PENDING REVIEW</p>
              <p className="text-3xl font-bold text-gray-900 mt-0.5">08</p>
            </div>
          </div>
        </div>

        {/* Body: two-column */}
        <div className="flex gap-5 items-start">
          {/* ── Left: Active Queue ── */}
          <div className="w-64 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700">Active Queue</h2>
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md px-2 py-1 transition-colors">
                <Filter className="w-3 h-3" /> Filter
              </button>
            </div>

            <div className="space-y-3">
              {CLAIMS.map((claim) => (
                <button
                  key={claim.id}
                  onClick={() => setSelectedId(claim.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedId === claim.id
                      ? "border-teal-400 bg-white shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${CLAIM_TYPE_STYLES[claim.type]}`}>
                      {claim.type}
                    </span>
                    <span className="text-[10px] text-gray-400">#{claim.id}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{claim.customer}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{claim.product}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" /> {claim.timeAgo}
                    </span>
                    <span className={`text-[11px] ${STATUS_STYLES[claim.status]}`}>{claim.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Claim Detail ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* Claim Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Claim Analysis: <span className="text-teal-600">#{detail.id}</span></h2>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
                    <User className="w-3.5 h-3.5" />
                    <span>{detail.customer} • Member since {detail.memberSince}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${WARRANTY_STYLES[detail.warrantyStatus]}`}>
                    {detail.warrantyStatus}
                  </span>
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    <Printer className="w-3.5 h-3.5" /> Print Report
                  </button>
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    <History className="w-3.5 h-3.5" /> History
                  </button>
                </div>
              </div>

              {/* Two-col layout: Issue + Clinical Data */}
              <div className="grid grid-cols-5 gap-5 mb-5">
                {/* Issue Description */}
                <div className="col-span-3">
                  <p className="text-[10px] font-semibold text-gray-400 tracking-widest mb-2">ISSUE DESCRIPTION</p>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 italic leading-relaxed">{detail.issueDescription}</p>
                  </div>

                  {/* Photo Evidence */}
                  <p className="text-[10px] font-semibold text-gray-400 tracking-widest mt-4 mb-2">PHOTO EVIDENCE OF DEFECT</p>
                  <div className="flex gap-3">
                    {/* Placeholder images */}
                    <div className="w-28 h-24 rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-200">
                      <div className="w-16 h-16 rounded-full border-4 border-gray-600 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-gray-500" />
                        </div>
                      </div>
                    </div>
                    <div className="w-28 h-24 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200">
                      <div className="w-12 h-12 border-2 border-amber-400 flex items-center justify-center">
                        <div className="w-5 h-5 bg-amber-400 opacity-60" />
                      </div>
                    </div>
                    <button className="w-28 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-teal-300 hover:text-teal-400 transition-colors">
                      <span className="text-2xl leading-none">+</span>
                      <span className="text-[10px]">Add photo</span>
                    </button>
                  </div>
                </div>

                {/* Clinical Data Cluster */}
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold text-gray-400 tracking-widest mb-2">CLINICAL DATA CLUSTER</p>
                  <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
                    {[
                      { label: "Original Product", value: detail.originalProduct },
                      { label: "Purchase Date", value: detail.purchaseDate },
                      { label: "Warranty Type", value: detail.warrantyType },
                      {
                        label: "Remaining Term",
                        value: detail.remainingTerm,
                        highlight: detail.remainingTerm !== "Expired",
                      },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="px-4 py-3 flex items-start justify-between gap-2">
                        <span className="text-xs text-gray-400 shrink-0">{label}</span>
                        <span className={`text-xs font-semibold text-right ${highlight ? "text-teal-600" : "text-gray-700"}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Staff Assessment Note */}
                  <p className="text-[10px] font-semibold text-gray-400 tracking-widest mt-4 mb-2">STAFF ASSESSMENT NOTE</p>
                  <textarea
                    value={staffNote}
                    onChange={(e) => setStaffNote(e.target.value)}
                    placeholder="Add internal medical notes or claim observations..."
                    rows={4}
                    className="w-full text-xs text-gray-600 placeholder-gray-300 border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white"
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="border-t border-gray-100 pt-5 space-y-3">
                {/* Toast */}
                {actionMsg && (
                  <div className="bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold rounded-lg px-4 py-2">
                    {actionMsg}
                  </div>
                )}

                {/* Reject row */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAction("Claim Rejection")}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject Claim
                  </button>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-red-300 text-gray-500 appearance-none cursor-pointer"
                  >
                    <option value="">Select Reason...</option>
                    {REJECT_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Approve row */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAction("Replacement Approval")}
                    className="flex items-center gap-2 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Approve Replacement
                  </button>
                  <button
                    onClick={() => handleAction("Refund Approval")}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <BadgeDollarSign className="w-4 h-4" /> Approve Refund
                  </button>
                </div>
              </div>
            </div>

            {/* Audit Trail */}
            <button className="w-full mt-3 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-700">Audit Trail Entry</p>
                  <p className="text-xs text-gray-400">Last activity: {detail.auditLog}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          </div>
        </div>
      </main>
  );
}