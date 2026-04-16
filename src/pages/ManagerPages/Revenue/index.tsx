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

// --- Mock Data ---
const dailyData = [
  { name: '01/03', value: 12.5 }, { name: '02/03', value: 9 }, { name: '03/03', value: 15 },
  { name: '04/03', value: 10 }, { name: '05/03', value: 18.5 }, { name: '06/03', value: 8 },
  { name: '07/03', value: 11 }, { name: '08/03', value: 14.5 }, { name: '09/03', value: 6.5 },
  { name: '10/03', value: 20 }, { name: '11/03', value: 13.5 }, { name: '12/03', value: 16.5 },
  { name: '13/03', value: 10.5 }, { name: '14/03', value: 21 },
];

const weeklyData = [
  { name: 'Tuần 1', value: 45 }, { name: 'Tuần 2', value: 52 }, { name: 'Tuần 3', value: 39 },
  { name: 'Tuần 4', value: 61 }, { name: 'Tuần 5', value: 48 }, { name: 'Tuần 6', value: 55 },
  { name: 'Tuần 7', value: 43 }, { name: 'Tuần 8', value: 59 },
];

const monthlyData = [
  { name: 'T1', value: 32 }, { name: 'T2', value: 28 }, { name: 'T3', value: 45 },
  { name: 'T4', value: 38 }, { name: 'T5', value: 52 }, { name: 'T6', value: 61 },
  { name: 'T7', value: 48 }, { name: 'T8', value: 55 }, { name: 'T9', value: 42 },
  { name: 'T10', value: 39 }, { name: 'T11', value: 47 }, { name: 'T12', value: 58 },
];

const Revenue = () => {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');

  return (
    <div className="overflow-y-auto p-8 bg-gray-50 font-sans text-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Thống kê doanh thu</h1>
        <p className="text-gray-500 text-sm">Báo cáo doanh thu theo ngày, tuần, tháng, năm</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Doanh thu hôm nay" value="21.000.000 ₫" change="+15%" subText="so với hôm qua" icon={<DollarSign size={18}/>} color="teal" />
        <StatCard title="Doanh thu tuần này" value="403.900.000 ₫" change="+8%" subText="so với tuần trước" icon={<TrendingUp size={18}/>} color="emerald" />
        <StatCard title="Doanh thu tháng này" value="58.000.000 ₫" change="+12%" subText="so với tháng trước" icon={<Calendar size={18}/>} color="teal" />
        <StatCard title="Doanh thu năm" value="545.000.000 ₫" subText="Tổng cộng 12 tháng" icon={<ShoppingCart size={18}/>} color="teal" />
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
              <AreaChart data={dailyData}>
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
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `${v}M`} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            ) : (
              <BarChart data={monthlyData}>
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