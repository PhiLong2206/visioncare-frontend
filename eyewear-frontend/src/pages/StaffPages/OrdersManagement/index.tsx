import { useState, ReactElement } from "react";
import { LayoutDashboard, Clipboard, Clock, CreditCard, Settings, Eye } from 'lucide-react'

type OrderType = "NORMAL" | "ON SITE" | "PRE-ORDER";
type OrderStatus = "SENT TO LAB" | "AWAITING VERIFICATION" | "PROCESSING" | "CANCELLED";
type PrescriptionStatus = "Verified" | "Manual Check Required" | "No Rx Attached";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  orderType: OrderType;
  prescription: PrescriptionStatus;
  status: OrderStatus;
}

const ORDERS: Order[] = [
  {
    id: "ORD-8821",
    customer: "Eleanor Shellstrop",
    email: "e.shell@example.com",
    date: "Oct 24, 2023",
    orderType: "NORMAL",
    prescription: "Verified",
    status: "SENT TO LAB",
  },
  {
    id: "ORD-8822",
    customer: "Chidi Anagonye",
    email: "chidi.a@university.edu",
    date: "Oct 24, 2023",
    orderType: "ON SITE",
    prescription: "Manual Check Required",
    status: "AWAITING VERIFICATION",
  },
  {
    id: "ORD-8823",
    customer: "Tahani Al-Jamil",
    email: "tahani@social.uk",
    date: "Oct 23, 2023",
    orderType: "PRE-ORDER",
    prescription: "Verified",
    status: "PROCESSING",
  },
  {
    id: "ORD-8824",
    customer: "Jason Mendoza",
    email: "bortles@florida.com",
    date: "Oct 23, 2023",
    orderType: "NORMAL",
    prescription: "No Rx Attached",
    status: "CANCELLED",
  },
];

const ORDER_TYPE_STYLES: Record<OrderType, string> = {
  NORMAL: "bg-blue-100 text-blue-700",
  "ON SITE": "bg-green-100 text-green-700",
  "PRE-ORDER": "bg-purple-100 text-purple-700",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  "SENT TO LAB": "bg-teal-100 text-teal-700",
  "AWAITING VERIFICATION": "bg-orange-100 text-orange-700",
  PROCESSING: "bg-gray-200 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

const PRESCRIPTION_ICON: Record<PrescriptionStatus, ReactElement> = {
  Verified: (
    <span className="inline-flex items-center gap-1 text-teal-600 font-medium text-sm">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  ),
  "Manual Check Required": (
    <span className="inline-flex items-center gap-1 text-orange-500 font-medium text-sm">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      Manual Check Required
    </span>
  ),
  "No Rx Attached": (
    <span className="inline-flex items-center gap-1 text-gray-400 font-medium text-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      No Rx Attached
    </span>
  ),
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function OrdersManagement() {
  const [activeNav, setActiveNav] = useState("ORDERS");
  const [activeTab, setActiveTab] = useState("Orders");
  const [orderTypeFilter, setOrderTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const navItems = [
    { label: "DASHBOARD", icon: <LayoutDashboard /> },
    { label: "ORDERS", icon: <Clipboard /> },
    { label: "PRE-ORDERS", icon: <Clock /> },
    { label: "CLAIMS/REFUNDS", icon: <CreditCard /> },
    { label: "SETTINGS", icon: <Settings /> },
  ];

  const filtered = ORDERS.filter((o) => {
    const typeOk = orderTypeFilter === "All Types" || o.orderType === orderTypeFilter;
    const statusOk = statusFilter === "All Statuses" || o.status === statusFilter;
    return typeOk && statusOk;
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
              <Eye color="white"/>
            </div>
            <span className="font-bold text-gray-800 text-base tracking-tight">Clinical Clarity</span>
          </div>
        </div>

        {/* User */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">Vision Care Admin</p>
          <p className="text-xs text-teal-500 font-medium tracking-wide mt-0.5">EXPERT CURATION</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                activeNav === label
                  ? "bg-teal-50 text-teal-600"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              }`}
            >
              <span className={activeNav === label ? "text-teal-500" : ""}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between h-12 shrink-0">
          {/* Tabs */}
          <nav className="flex gap-6 h-full">
            {["Dashboard", "Orders", "Pre-orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative h-full text-sm font-medium transition-colors ${
                  activeTab === tab ? "text-teal-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-t" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Global Search..."
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            {/* Bell */}
            <button className="relative text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="text-sm font-medium text-gray-700">Dr. Aris</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-sm text-gray-400 mt-1">Manage, verify, and track all vision care prescriptions and fulfillment.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-4">
            <div className="flex items-center gap-4">
              {/* Order Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-widest mb-1.5">ORDER TYPE</label>
                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none cursor-pointer min-w-32"
                >
                  <option>All Types</option>
                  <option>NORMAL</option>
                  <option>ON SITE</option>
                  <option>PRE-ORDER</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-widest mb-1.5">STATUS</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none cursor-pointer min-w-36"
                >
                  <option>All Statuses</option>
                  <option>SENT TO LAB</option>
                  <option>AWAITING VERIFICATION</option>
                  <option>PROCESSING</option>
                  <option>CANCELLED</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-widest mb-1.5">DATE RANGE</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-40 cursor-pointer">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-400">Select dates...</span>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Reset */}
              <button
                onClick={() => { setOrderTypeFilter("All Types"); setStatusFilter("All Statuses"); }}
                className="text-sm text-teal-500 font-semibold hover:text-teal-700 mt-5 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["ORDER ID", "CUSTOMER", "DATE", "ORDER TYPE", "PRESCRIPTION", "STATUS", "ACTIONS"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 tracking-widest px-5 py-3.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                  >
                    {/* ID */}
                    <td className="px-5 py-4">
                      <button className="text-teal-500 font-semibold text-sm hover:text-teal-700 hover:underline">
                        #{order.id}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800 text-sm">{order.customer}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.email}</p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-gray-500">{order.date}</td>

                    {/* Order Type */}
                    <td className="px-5 py-4">
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md tracking-wide ${ORDER_TYPE_STYLES[order.orderType]}`}>
                        {order.orderType}
                      </span>
                    </td>

                    {/* Prescription */}
                    <td className="px-5 py-4">{PRESCRIPTION_ICON[order.prescription]}</td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md tracking-wide ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-teal-500 transition-colors" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-blue-500 transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Showing 1–10 of 1,284 orders</p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold transition-colors ${
                      p === 1 ? "bg-teal-500 text-white" : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="text-gray-400 text-xs px-1">...</span>
                <button className="w-7 h-7 flex items-center justify-center rounded text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                  129
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 text-xs text-gray-300">
            <span>CLINICAL CLARITY MANAGEMENT SYSTEM V2.4.0</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-500 transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:text-gray-500 transition-colors">SUPPORT CENTER</a>
              <a href="#" className="hover:text-gray-500 transition-colors">SYSTEM STATUS</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}