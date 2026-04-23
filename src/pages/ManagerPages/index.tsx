import { useState } from "react";
import SideBar from "./SideBar";
import Dashboard from "./Dashboard";
import Team from "./Team";
import Pricing from "./Pricing";
import Refund from "./ClaimNRefund";
import ProductManagement from "./Inventory";
import InventoryApproval from "./Receipt";
import Revenue from "./Revenue";
import CampaignsManagement from "./Campaigns";
import ModernHeader from "../../components/ModernHeader";

export default function ManagerPage() {
    const [activeNav, setActiveNav] = useState("DASHBOARD");

    const getTitle = () => {
        switch(activeNav) {
            case "DASHBOARD": return "Bảng điều khiển";
            case "REVENUE": return "Báo cáo Doanh thu";
            case "PRODUCTS": return "Quản lý Sản phẩm";
            case "RECEIPT": return "Duyệt Phiếu nhập";
            default: return "Manager Dashboard";
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
            {/* Sidebar */}
            <SideBar activeNav={activeNav} setActiveNav={setActiveNav} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Standardized Header */}
                <ModernHeader title={getTitle()} showBackButton={false} />

                <main className="flex-1 overflow-y-auto">
                    {activeNav === "DASHBOARD" ? (
                        <Dashboard />
                    ) : activeNav === "PRODUCTS" ? (
                        <ProductManagement />
                    ) : activeNav === "REVENUE" ? (
                        <Revenue />
                    ) : activeNav === "RECEIPT" ? (
                        <InventoryApproval />
                    ) : null}
                </main>
            </div>
        </div>
    );
}