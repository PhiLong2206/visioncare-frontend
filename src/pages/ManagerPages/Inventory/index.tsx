import { useState } from "react";
import {
  Download,
  RefreshCw,
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  TrendingUp,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";

// --- Types ---
type StockLevel = "high" | "low" | "medium";

interface Variant {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  material: string;
  materialSub: string;
  colorway: string;
  colorHex: string;
  size: string;
  bridge: string;
  skuId: string;
  stock: number;
  stockLevel: StockLevel;
  price: number;
  image: string;
}

// --- Mock Data ---
const variants: Variant[] = [
  {
    id: 1,
    name: "Atlas Geometric",
    subtitle: "Round Prescription Frames",
    description: "Round Prescription Frames",
    material: "Mazzucchelli",
    materialSub: "Acetate",
    colorway: "DARK TORTOISE",
    colorHex: "#3B2006",
    size: "52",
    bridge: "18",
    skuId: "VC-ATL-5218-TORT",
    stock: 42,
    stockLevel: "high",
    price: 185.0,
    image: "",
  },
  {
    id: 2,
    name: "Linear Aviator",
    subtitle: "Brushed Titanium Series",
    description: "Brushed Titanium Series",
    material: "Pure",
    materialSub: "Titanium",
    colorway: "BRUSHED GOLD",
    colorHex: "#C9A84C",
    size: "58",
    bridge: "14",
    skuId: "VC-LIN-5814-GLD",
    stock: 3,
    stockLevel: "low",
    price: 340.0,
    image: "",
  },
  {
    id: 3,
    name: "Observer Rect",
    subtitle: "Modernist Thick Frame",
    description: "Modernist Thick Frame",
    material: "Recycled",
    materialSub: "Nylon",
    colorway: "ONYX MATTE",
    colorHex: "#1A1A1A",
    size: "54",
    bridge: "20",
    skuId: "VC-OBS-5420-ONYX",
    stock: 118,
    stockLevel: "medium",
    price: 125.0,
    image: "",
  },
  {
    id: 4,
    name: "Vega Oval",
    subtitle: "Heritage Cellulose Series",
    description: "Heritage Cellulose Series",
    material: "Italian",
    materialSub: "Acetate",
    colorway: "AMBER HORN",
    colorHex: "#8B5E3C",
    size: "50",
    bridge: "16",
    skuId: "VC-VEG-5016-AMB",
    stock: 27,
    stockLevel: "medium",
    price: 220.0,
    image: "",
  },
];

// --- Helpers ---
const stockConfig: Record<StockLevel, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-emerald-100", text: "text-emerald-700", label: "In Stock" },
  medium: { bg: "bg-teal-100", text: "text-teal-700", label: "In Stock" },
  low: { bg: "bg-rose-100", text: "text-rose-600", label: "In Stock" },
};

function FrameThumb({ colorHex, name }: { colorHex: string; name: string }) {
  return (
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-inner border border-black/10"
      style={{ backgroundColor: colorHex }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function StockBadge({ stock, level }: { stock: number; level: StockLevel }) {
  const cfg = stockConfig[level];
  return (
    <div
      className={`inline-flex flex-col items-center justify-center w-14 h-14 rounded-full text-center ${cfg.bg} ${cfg.text}`}
    >
      <span className="text-sm font-extrabold leading-none">{stock}</span>
      <span className="text-[9px] font-semibold leading-tight">In<br />Stock</span>
    </div>
  );
}

// --- Metric Card ---
function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  subColor = "text-slate-400",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  subColor?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-2">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <Icon size={12} className="text-slate-400" />
        {label}
      </p>
      <p className="text-3xl font-extrabold tracking-tight text-slate-800">{value}</p>
      <p className={`text-xs font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}

// --- Main ---
export default function Inventory() {
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState("Acetate Series");
  const [page, setPage] = useState(1);
  const [goTo, setGoTo] = useState("1");

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    setSelected(selected.length === variants.length ? [] : variants.map((v) => v.id));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 font-sans p-6">
      <div className="mx-auto space-y-3">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-teal-600 cursor-pointer transition">Inventory</span>
          <ChevronRight size={12} />
          <span className="text-teal-600 font-semibold">Product Variations</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Artisan Frame Configurator
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-md">
              Manage technical specifications, colorways, and SKU clusters for the premium acetate collection.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition shadow-sm">
              <Download size={15} />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition shadow-md">
              <RefreshCw size={15} />
              Bulk Update
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={Layers}
            label="Total SKUs"
            value="1,248"
            sub="↑ +12% this month"
            subColor="text-emerald-500"
          />
          <MetricCard
            icon={AlertCircle}
            label="Low Stock"
            value="14"
            sub="Action required for 3 brands"
            subColor="text-rose-500"
          />
          <MetricCard
            icon={Clock}
            label="Lead Time"
            value="8.2 days"
            sub="● Optimized"
            subColor="text-teal-500"
          />
          <MetricCard
            icon={TrendingUp}
            label="Active Variants"
            value="42"
            sub="Across 5 frame styles"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Filter Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Filter by:
              </span>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                {filter}
                <ChevronDown size={14} />
              </button>
              <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
                <SlidersHorizontal size={14} />
              </button>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing 1–12 of 124 Variants
            </span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[2rem_2fr_1fr_1.2fr_1fr_1.1fr_1fr_2fr] items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
            <input
              type="checkbox"
              checked={selected.length === variants.length}
              onChange={toggleAll}
              className="accent-teal-600 w-4 h-4 rounded"
            />
            {["Variation Details", "Material", "Colorway", "Size/Bridge", "SKU / ID", "Stock Status", "Unit Price"].map(
              (h, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {h}
                </span>
              )
            )}
          </div>

          {/* Rows */}
          {variants.map((v, i) => (
            <div
              key={v.id}
              className={`grid grid-cols-[2rem_2fr_1fr_1.2fr_1fr_1.1fr_1fr_2fr] items-center gap-3 px-5 py-4 transition hover:bg-slate-50 ${
                i !== variants.length - 1 ? "border-b border-slate-100" : ""
              } ${selected.includes(v.id) ? "bg-teal-50/40" : ""}`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selected.includes(v.id)}
                onChange={() => toggleSelect(v.id)}
                className="accent-teal-600 w-4 h-4 rounded"
              />

              {/* Variation Details */}
              <div className="flex items-center gap-3">
                <FrameThumb colorHex={v.colorHex} name={v.name} />
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{v.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{v.subtitle}</p>
                </div>
              </div>

              {/* Material */}
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 w-fit">
                  {v.material}
                </span>
                <span className="text-[11px] text-slate-400">{v.materialSub}</span>
              </div>

              {/* Colorway */}
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shadow-sm shrink-0"
                  style={{ backgroundColor: v.colorHex }}
                />
                <span className="text-[11px] font-semibold text-slate-600 leading-tight">
                  {v.colorway}
                </span>
              </div>

              {/* Size/Bridge */}
              <div>
                <p className="text-sm font-bold text-teal-600">
                  {v.size} / {v.bridge}
                </p>
                <p className="text-[10px] text-slate-400">Standard Bridge</p>
              </div>

              {/* SKU */}
              <div className="font-mono text-[10px] text-slate-500 leading-relaxed">
                {v.skuId.split("-").map((seg, i) => (
                  <span key={i} className="block">{i === 0 ? seg : `${seg}`}</span>
                ))}
              </div>

              {/* Stock */}
              <div>
                <StockBadge stock={v.stock} level={v.stockLevel} />
              </div>

              {/* Price */}
              <div className="text-sm font-extrabold text-slate-800">
                ${v.price.toFixed(2)}
              </div>

              {/* Actions */}
              {/* <button className="p-1 rounded-lg hover:bg-slate-100 transition text-slate-400">
                <MoreVertical size={16} />
              </button> */}
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition text-slate-500"
              >
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition ${
                    page === n
                      ? "bg-teal-600 text-white shadow"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(3, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition text-slate-500"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Go to page</span>
              <input
                type="number"
                value={goTo}
                onChange={(e) => setGoTo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = parseInt(goTo);
                    if (n >= 1 && n <= 3) setPage(n);
                  }
                }}
                className="w-12 text-center border border-slate-200 rounded-lg py-1 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}