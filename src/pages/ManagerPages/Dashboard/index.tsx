import React from 'react';
import { 
  ShoppingCart, 
  DollarSign, 
  Box, 
  Users, 
  RotateCcw 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- Mock Data ---
const barData = [
  { name: 'T1', revenue: 32000000 },
  { name: 'T2', revenue: 28000000 },
  { name: 'T3', revenue: 45000000 },
  { name: 'T4', revenue: 38000000 },
  { name: 'T5', revenue: 52000000 },
  { name: 'T6', revenue: 61000000 },
  { name: 'T7', revenue: 48000000 },
  { name: 'T8', revenue: 55000000 },
  { name: 'T9', revenue: 42000000 },
  { name: 'T10', revenue: 39000000 },
  { name: 'T11', revenue: 47000000 },
  { name: 'T12', revenue: 58000000 },
];

const pieData = [
  { name: 'Kính mát / Phụ kiện', value: 65, color: '#f59e0b' }, // Orange-500
  { name: 'Tròng (Prescription)', value: 58, color: '#3b82f6' }, // Blue-500
  { name: 'Pre-order', value: 33, color: '#14b8a6' },           // Teal-500
];

const Dashboard = () => {
  return (
    <div className="overflow-y-auto p-6 bg-gray-50 font-sans">
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard 
          title="Tổng đơn hàng" 
          value="156" 
          change="+12%" 
          icon={<ShoppingCart size={20} />} 
        />
        <StatCard 
          title="Doanh thu" 
          value="485.600.000 ₫" 
          change="+8%" 
          icon={<DollarSign size={20} />} 
        />
        <StatCard 
          title="Sản phẩm" 
          value="87" 
          icon={<Box size={20} />} 
        />
        <StatCard 
          title="Khách hàng" 
          value="1243" 
          change="+23%" 
          icon={<Users size={20} />} 
        />
        <StatCard 
          title="Đổi trả chờ duyệt" 
          value="1" 
          subValue="cần xử lý"
          icon={<RotateCcw size={20} />} 
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart Container */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-8 text-slate-800">Doanh thu theo tháng</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  tickFormatter={(value: any) => `${value / 1000000}M`}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-lg">
                          <p className="font-bold text-slate-700 mb-1">{label}</p>
                          <p className="text-teal-500 text-sm">
                            revenue : {payload[0].value?.toLocaleString()} ₫
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#14b8a6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Container */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-8 text-slate-800">Đơn hàng theo loại</h3>
          <div className="h-[350px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={120}
                  paddingAngle={0}
                  dataKey="value"
                  label={({ name, value }: any) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-components ---

const StatCard = ({ title, value, change, icon, subValue }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
    <div className="flex justify-between items-start">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <div className="p-2 bg-teal-50 text-teal-500 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
      <div className="flex items-center mt-1">
        {change && (
          <span className="text-emerald-500 text-xs font-bold mr-1">{change}</span>
        )}
        <span className="text-gray-400 text-xs">
          {change ? "so với tháng trước" : subValue}
        </span>
      </div>
    </div>
  </div>
);

export default Dashboard;