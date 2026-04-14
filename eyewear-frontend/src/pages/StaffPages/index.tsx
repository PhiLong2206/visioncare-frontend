import { useState, ReactElement } from "react";
import SideBar from "./SideBar";
import OrdersManagement from "./OrdersManagement";
import { Bell } from "lucide-react";
import ClaimsRefunds from "./ClaimNRefund";
import Settings from "./Settings";

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StaffPage() {
    const [activeNav, setActiveNav] = useState("ORDERS");

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
            {/* ── Sidebar ── */}
            <SideBar activeNav={activeNav} setActiveNav={setActiveNav} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-6 flex items-center justify-end h-12 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input type="text" placeholder="Tìm kiếm..." className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-teal-400" />
                        </div>
                        <button className="relative text-gray-400 hover:text-gray-600">
                            <Bell size={20} />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                            <span className="text-sm font-medium text-gray-700">Dr. Aris</span>
                        </div>
                    </div>
                </header>

                {activeNav === "ORDERS" ? (
                    <OrdersManagement />
                ) : activeNav === "CLAIMS/REFUNDS" ? (
                    <ClaimsRefunds />
                ) : activeNav === "SETTINGS" ? (
                    <Settings />
                ) : null}
                
            </div>
        </div>
    );
}