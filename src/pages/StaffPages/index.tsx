import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import OrdersManagement from "./OrdersManagement";
import PreOrdersManagement from "./PreOrdersManagement";
import { useAuth } from "../../context/AuthContext";
import ModernHeader from "../../components/ModernHeader";

export default function StaffPage() {
    const [activeNav, setActiveNav] = useState("ORDERS");
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn || !user) {
            navigate("/login");
            return;
        }
        const isSalesStaff = user.roleId != null ? Number(user.roleId) === 3 : ["Staff", "Sales", "SalesStaff"].includes(user.role);
        if (!isSalesStaff) {
            navigate("/");
        }
    }, [isLoggedIn, user, navigate]);

    if (!isLoggedIn || !user) return null;

    const getTitle = () => {
        switch(activeNav) {
            case "ORDERS": return "Quản lý Đơn hàng";
            case "PRE_ORDERS": return "Quản lý Đặt trước";
            default: return "Staff Dashboard";
        }
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800">
            {/* Sidebar */}
            <SideBar activeNav={activeNav} setActiveNav={setActiveNav} />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
               {/* Unified Header */}
               <ModernHeader title={getTitle()} showBackButton={false} />

               <main className="flex-1 overflow-y-auto">
                 {activeNav === "ORDERS" ? (
                     <div className="p-10"><OrdersManagement /></div>
                 ) : null}
                 {activeNav === "PRE_ORDERS" ? (
                     <PreOrdersManagement />
                 ) : null}
               </main>
            </div>
        </div>
    );
}
