import { useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  TrendingDown,
  UserPlus,
  Glasses,
  Eye,
  PackageOpen,
  TrendingUp,
} from "lucide-react";

// --- Data ---
const monthlyData = [
  { month: "JAN", current: 38000, prev: 29000 },
  { month: "FEB", current: 52000, prev: 38000 },
  { month: "MAR", current: 45000, prev: 40000 },
  { month: "APR", current: 60000, prev: 44000 },
  { month: "MAY", current: 72000, prev: 52000 },
  { month: "JUN", current: 30000, prev: 26000 },
];

const maxVal = Math.max(...monthlyData.flatMap((d) => [d.current, d.prev]));

const salesBreakdown = [
  {
    label: "Frames",
    value: 124500,
    pct: 65,
    color: "bg-teal-600",
    icon: Glasses,
  },
  {
    label: "Lenses",
    value: 82300,
    pct: 42,
    color: "bg-teal-400",
    icon: Eye,
  },
  {
    label: "Contact Lenses",
    value: 45192,
    pct: 28,
    color: "bg-teal-300",
    icon: PackageOpen,
  },
];

// --- Metric Card ---
type MetricCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  up: boolean;
};

function MetricCard({ icon: Icon, label, value, change, up }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
          <Icon size={18} className="text-teal-600" />
        </div>
        <span
          className={`text-xs font-semibold flex items-center gap-0.5 ${
            up ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {change}
        </span>
      </div>
      <div>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

// --- Bar Chart ---
type Period = "Yearly" | "Quarterly";

function BarChart({ period }: { period: Period }) {
  const data =
    period === "Quarterly" ? monthlyData.slice(3) : monthlyData;

  return (
    <div className="flex items-end gap-3 h-44 mt-4">
      {data.map((d) => {
        const curH = Math.round((d.current / maxVal) * 100);
        const prevH = Math.round((d.prev / maxVal) * 100);
        return (
          <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-end gap-1 w-full justify-center" style={{ height: "160px" }}>
              <div
                className="w-5 rounded-t-md bg-slate-200 transition-all duration-500"
                style={{ height: `${prevH}%` }}
              />
              <div
                className="w-5 rounded-t-md bg-teal-600 transition-all duration-500"
                style={{ height: `${curH}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// --- Sales Breakdown Row ---
function SalesRow({
  label,
  value,
  pct,
  color,
  icon: Icon,
}: (typeof salesBreakdown)[0]) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
            <Icon size={14} className="text-teal-600" />
          </div>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-800">
          ${value.toLocaleString()}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-400">{pct}% of Total Revenue</p>
    </div>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("Yearly");

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manager Revenue Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time fiscal performance and clinical operational health.{" "}
            <span className="text-slate-500">
              Expert curation of pharmacy and optical sales data.
            </span>
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={DollarSign}
            label="Total Revenue"
            value="$284,392.00"
            change="12.4%"
            up={true}
          />
          <MetricCard
            icon={ShoppingBag}
            label="Avg Order Value"
            value="$412.50"
            change="5.2%"
            up={true}
          />
          <MetricCard
            icon={Eye}
            label="Conversion Rate"
            value="34.2%"
            change="1.8%"
            up={false}
          />
          <MetricCard
            icon={UserPlus}
            label="New Patients"
            value="1,204"
            change="22%"
            up={true}
          />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Bar Chart */}
          <div className="md:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Monthly Revenue Trends
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Comparative performance (Current vs. Prev Year)
                </p>
              </div>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                {(["Yearly", "Quarterly"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                      period === p
                        ? "bg-white text-slate-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <BarChart period={period} />

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-teal-600" />
                <span className="text-[11px] text-slate-500">Current Year</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-slate-200" />
                <span className="text-[11px] text-slate-500">Prev Year</span>
              </div>
            </div>
          </div>

          {/* Sales Breakdown */}
          <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Sales Breakdown
            </h2>
            <div className="flex flex-col gap-5">
              {salesBreakdown.map((item) => (
                <SalesRow key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}