import { useState, useEffect } from "react";
import {
    Users,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity
} from "lucide-react";
import { getDashboardStats } from "../../api/adminAPI";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch {
                console.error("Fetch stats failed");
                toast.error("Không tải được dữ liệu dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center text-slate-500">
                Đang tải dữ liệu...
            </div>
        );
    }

    const statCards = [
        {
            title: "Tổng người dùng",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "bg-blue-500",
            trend: "+5.2%",
        },
        {
            title: "Đơn hàng mới",
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: "bg-emerald-500",
            trend: "+12.1%",
        },
        {
            title: "Doanh thu",
            value: `${(stats?.totalRevenue || 0).toLocaleString()}đ`,
            icon: DollarSign,
            color: "bg-amber-500",
            trend: "+8.4%",
        },
    ];

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <Activity className="text-cyan-500" size={32} />
                    Hệ thống Tổng quan
                </h1>
                <p className="mt-1 text-[16px] text-slate-500">
                    Số liệu thống kê toàn bộ hệ thống VisionCare
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {statCards.map((stat, idx) => (
                    <div
                        key={idx}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex justify-between mb-4">
                            <div className={`h-12 w-12 ${stat.color} text-white rounded-xl flex items-center justify-center`}>
                                <stat.icon size={24} />
                            </div>

                            <div className={`flex items-center text-sm font-bold ${stat.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                                {stat.trend}
                                {stat.trend.startsWith("+") ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>

                        <h3 className="text-sm text-slate-500">{stat.title}</h3>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}