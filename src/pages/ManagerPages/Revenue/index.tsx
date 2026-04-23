import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ShoppingCart 
} from 'lucide-react';
import {
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getSalesSummary } from '../../../api/salesReportAPI';

// --- Mock Data ---
const dailyData: any[] = [];
const weeklyData: any[] = [];
const monthlyData: any[] = [];

const Revenue = () => {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSalesSummary({ period: activeTab === 'day' ? 'Daily' : activeTab === 'week' ? 'Weekly' : 'Monthly' });
      setSummary(data);
    } catch (error) {
      console.error("Fetch sales summary failed");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  return (
    <div className="overflow-y-auto p-8 bg-gray-50 font-sans text-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Thống kê doanh thu</h1>
        <p className="text-gray-500 text-sm">Báo cáo doanh thu theo ngày, tuần, tháng, năm</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Doanh thu hôm nay" 
          value={loading ? "..." : formatCurrency(summary?.dailyRevenue || 0)} 
          change="+15%" 
          subText="so với hôm qua" 
          icon={<DollarSign size={18}/>} 
          color="teal" 
        />
        <StatCard 
          title="Doanh thu tuần này" 
          value={loading ? "..." : formatCurrency(summary?.weeklyRevenue || 0)} 
          change="+8%" 
          subText="so với tuần trước" 
          icon={<TrendingUp size={18}/>} 
          color="emerald" 
        />
        <StatCard 
          title="Doanh thu tháng này" 
          value={loading ? "..." : formatCurrency(summary?.monthlyRevenue || 0)} 
          change="+12%" 
          subText="so với tháng trước" 
          icon={<Calendar size={18}/>} 
          color="teal" 
        />
        <StatCard 
          title="Doanh thu năm" 
          value={loading ? "..." : formatCurrency(summary?.yearlyRevenue || 0)} 
          subText="Tổng cộng 12 tháng" 
          icon={<ShoppingCart size={18}/>} 
          color="teal" 
        />
      </div>

      {/* Tab Switcher */}
      <div className="inline-flex p-1 bg-gray-200/50 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab('day')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'day' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-500 hover:text-slate-700'}`}
        >Theo ngày</button>
        <button 
          onClick={() => setActiveTab('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'week' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-500 hover:text-slate-700'}`}
        >Theo tuần</button>
        <button 
          onClick={() => setActiveTab('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'month' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-500 hover:text-slate-700'}`}
        >Theo tháng</button>
      </div>

      {/* Chart Container */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-10">
          {activeTab === 'day' && 'Doanh thu 14 ngày gần nhất'}
          {activeTab === 'week' && 'Doanh thu theo tuần'}
          {activeTab === 'month' && 'Doanh thu theo tháng (năm 2024)'}
        </h3>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'day' ? (
              <AreaChart data={summary?.chartData || dailyData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `${v}M`} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            ) : activeTab === 'week' ? (
              <LineChart data={summary?.chartData || weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `${v}M`} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            ) : (
              <BarChart data={summary?.chartData || monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `${v}M`} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Sub-component ---
const StatCard = ({ title, value, change, subText, icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <div className={`p-2 rounded-lg ${color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : 'bg-teal-50 text-teal-500'}`}>
        {icon}
      </div>
    </div>
    <h2 className="text-2xl font-bold mb-1">{value}</h2>
    <div className="flex items-center gap-1">
      {change && <span className="text-emerald-500 text-xs font-bold">{change}</span>}
      <span className="text-gray-400 text-xs">{subText}</span>
    </div>
  </div>
);

export default Revenue;