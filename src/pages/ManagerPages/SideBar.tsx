import { Eye, LayoutDashboard, Package, Banknote, BookOpenText, Users, CreditCard } from "lucide-react";

const navItems = [
    { text: "THỐNG KÊ", label: "DASHBOARD", icon: <LayoutDashboard /> },
    { text: "KHO", label: "INVENTORY", icon: <Package /> },
    { text: "GIÁ CẢ", label: "PRICING", icon: <Banknote /> },
    { text: "HOÀN/TRẢ", label: "CLAIMS/REFUNDS", icon: <CreditCard /> },
    // { label: "POLICIES", icon: <BookOpenText /> },
    // { label: "TEAM", icon: <Users /> },
];

type SideBarProps = {
    activeNav: string,
    setActiveNav: ((label: string) => void)
}

export default function SideBar({ activeNav, setActiveNav }: SideBarProps) {
    return (
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
            {/* Logo */}
            <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
                        <Eye color="white" />
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
                {navItems.map(({ text, label, icon }) => (
                    <button
                        key={label}
                        onClick={() => setActiveNav(label)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${activeNav === label
                            ? "bg-teal-50 text-teal-600"
                            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                            }`}
                    >
                        <span className={activeNav === label ? "text-teal-500" : ""}>{icon}</span>
                        {text}
                    </button>
                ))}
            </nav>
        </aside>
    )
}