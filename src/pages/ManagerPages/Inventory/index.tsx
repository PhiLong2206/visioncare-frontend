import { useState } from "react";
import {
  Download,
  RefreshCw,
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Layers,
  Plus,
  Minus,
  Trash2,
  X,
} from "lucide-react";

// --- Types ---
type StockLevel = "high" | "low" | "medium";

interface Variant {
  id: number;
  name: string;
  subtitle: string;
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
}

// --- Mock Data ---
const initialVariants: Variant[] = [
  {
    id: 1,
    name: "Atlas Hình Học",
    subtitle: "Gọng Tròn Cận Thị",
    material: "Mazzucchelli",
    materialSub: "Acetate",
    colorway: "ĐỒI MỒI TỐI",
    colorHex: "#3B2006",
    size: "52",
    bridge: "18",
    skuId: "VC-ATL-5218-TORT",
    stock: 42,
    stockLevel: "high",
    price: 185.0,
  },
  {
    id: 2,
    name: "Linear Phi Công",
    subtitle: "Dòng Titan Đánh Bóng",
    material: "Nguyên Chất",
    materialSub: "Titan",
    colorway: "VÀNG ĐÁNH BÓNG",
    colorHex: "#C9A84C",
    size: "58",
    bridge: "14",
    skuId: "VC-LIN-5814-GLD",
    stock: 3,
    stockLevel: "low",
    price: 340.0,
  },
  {
    id: 3,
    name: "Observer Chữ Nhật",
    subtitle: "Gọng Dày Hiện Đại",
    material: "Tái Chế",
    materialSub: "Nylon",
    colorway: "ĐEN MỜ",
    colorHex: "#1A1A1A",
    size: "54",
    bridge: "20",
    skuId: "VC-OBS-5420-ONYX",
    stock: 118,
    stockLevel: "medium",
    price: 125.0,
  },
  {
    id: 4,
    name: "Vega Bầu Dục",
    subtitle: "Dòng Cellulose Di Sản",
    material: "Ý",
    materialSub: "Acetate",
    colorway: "HỔ PHÁCH SỪNG",
    colorHex: "#8B5E3C",
    size: "50",
    bridge: "16",
    skuId: "VC-VEG-5016-AMB",
    stock: 27,
    stockLevel: "medium",
    price: 220.0,
  },
  {
    id: 5,
    name: "Cirque Mắt Mèo",
    subtitle: "Gọng Kính Thời Trang",
    material: "Pháp",
    materialSub: "Acetate",
    colorway: "ĐỎ SẪM",
    colorHex: "#C44B4B",
    size: "53",
    bridge: "17",
    skuId: "VC-CIR-5317-RED",
    stock: 15,
    stockLevel: "medium",
    price: 195.0,
  },
  {
    id: 6,
    name: "Nova Vuông",
    subtitle: "Dòng Thể Thao",
    material: "Tổng Hợp",
    materialSub: "Polycarbonate",
    colorway: "XANH ĐẬM",
    colorHex: "#2E4057",
    size: "56",
    bridge: "19",
    skuId: "VC-NOV-5619-BLU",
    stock: 0,
    stockLevel: "low",
    price: 155.0,
  },
  {
    id: 7,
    name: "Prism Lục Giác",
    subtitle: "Phiên Bản Giới Hạn",
    material: "Nhật Bản",
    materialSub: "Acetate",
    colorway: "TÍM ĐẬM",
    colorHex: "#6B3FA0",
    size: "51",
    bridge: "15",
    skuId: "VC-PRI-5115-PUR",
    stock: 8,
    stockLevel: "low",
    price: 280.0,
  },
];

// --- Helpers ---
const PER_PAGE = 5;

function computeStockLevel(stock: number): StockLevel {
  if (stock <= 5) return "low";
  if (stock <= 30) return "medium";
  return "high";
}

const stockConfig: Record<StockLevel, { bg: string; text: string }> = {
  high: { bg: "bg-emerald-100", text: "text-emerald-700" },
  medium: { bg: "bg-teal-100", text: "text-teal-700" },
  low: { bg: "bg-rose-100", text: "text-rose-600" },
};

function FrameThumb({ colorHex, name }: { colorHex: string; name: string }) {
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-inner border border-black/10 shrink-0"
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
      className={`inline-flex flex-col items-center justify-center w-12 h-12 rounded-full text-center ${cfg.bg} ${cfg.text}`}
    >
      <span className="text-sm font-extrabold leading-none">{stock}</span>
      <span className="text-[9px] font-semibold leading-tight">
        Còn
        <br />
        Hàng
      </span>
    </div>
  );
}

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

// --- Add Product Modal ---
const emptyForm = {
  name: "",
  subtitle: "",
  material: "",
  materialSub: "",
  colorway: "",
  colorHex: "#1D9E75",
  size: "",
  bridge: "",
  skuId: "",
  stock: 0,
  price: 0,
};

function AddProductModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (v: Omit<Variant, "id" | "stockLevel">) => void;
}) {
  const [form, setForm] = useState(emptyForm);

  const set = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên sản phẩm!");
    onSave({
      name: form.name,
      subtitle: form.subtitle,
      material: form.material,
      materialSub: form.materialSub,
      colorway: form.colorway,
      colorHex: form.colorHex,
      size: form.size,
      bridge: form.bridge,
      skuId: form.skuId,
      stock: Number(form.stock),
      price: Number(form.price),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 w-[480px] max-w-[95vw]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Thêm Sản Phẩm Mới</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Tên Sản Phẩm", field: "name", placeholder: "VD: Atlas Hình Học" },
            { label: "Phụ Đề", field: "subtitle", placeholder: "VD: Gọng Tròn Cận Thị" },
            { label: "Chất Liệu", field: "material", placeholder: "VD: Mazzucchelli" },
            { label: "Loại Vật Liệu", field: "materialSub", placeholder: "VD: Acetate" },
            { label: "Màu Sắc", field: "colorway", placeholder: "VD: ĐỒI MỒI TỐI" },
            { label: "Cỡ Kính", field: "size", placeholder: "VD: 52" },
            { label: "Cầu Kính", field: "bridge", placeholder: "VD: 18" },
            { label: "Mã SKU", field: "skuId", placeholder: "VD: VC-ATL-5218-TORT" },
          ].map(({ label, field, placeholder }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                {label}
              </label>
              <input
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder={placeholder}
                value={(form as Record<string, string | number>)[field] as string}
                onChange={(e) => set(field, e.target.value)}
              />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Mã Màu
            </label>
            <input
              type="color"
              className="border border-slate-200 rounded-lg px-2 py-1 h-10 cursor-pointer"
              value={form.colorHex}
              onChange={(e) => set("colorHex", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Tồn Kho Ban Đầu
            </label>
            <input
              type="number"
              min={0}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Đơn Giá (USD)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition shadow-md"
          >
            Lưu Sản Phẩm
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main ---
let nextId = initialVariants.length + 1;

export default function Inventory() {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [goTo, setGoTo] = useState("1");
  const [showModal, setShowModal] = useState(false);

  const totalPages = Math.ceil(variants.length / PER_PAGE);
  const pageVariants = variants.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleAll = () =>
    setSelected(
      selected.length === pageVariants.length
        ? selected.filter((id) => !pageVariants.find((v) => v.id === id))
        : [...new Set([...selected, ...pageVariants.map((v) => v.id)])]
    );

  const changeStock = (id: number, delta: number) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const newStock = Math.max(0, v.stock + delta);
        return { ...v, stock: newStock, stockLevel: computeStockLevel(newStock) };
      })
    );
  };

  const deleteVariant = (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    setVariants((prev) => prev.filter((v) => v.id !== id));
    setSelected((prev) => prev.filter((x) => x !== id));
    setPage((p) => Math.min(p, Math.ceil((variants.length - 1) / PER_PAGE) || 1));
  };

  const handleAddProduct = (data: Omit<Variant, "id" | "stockLevel">) => {
    const newVariant: Variant = {
      ...data,
      id: nextId++,
      stockLevel: computeStockLevel(data.stock),
    };
    setVariants((prev) => [...prev, newVariant]);
    setShowModal(false);
    setPage(Math.ceil((variants.length + 1) / PER_PAGE));
  };

  const goPage = (n: number) => {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    setGoTo(String(n));
  };

  const allPageSelected =
    pageVariants.length > 0 && pageVariants.every((v) => selected.includes(v.id));

  const lowStockCount = variants.filter((v) => v.stockLevel === "low").length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 font-sans p-6">
      <div className="mx-auto space-y-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-teal-600 cursor-pointer transition">Tồn Kho</span>
          <ChevronRight size={12} />
          <span className="text-teal-600 font-semibold">Biến Thể Sản Phẩm</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Cấu Hình Gọng Kính
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-md">
              Quản lý thông số kỹ thuật, màu sắc và mã SKU cho bộ sưu tập acetate cao cấp.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition shadow-sm">
              <Download size={15} />
              Xuất CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition shadow-sm">
              <RefreshCw size={15} />
              Cập Nhật Hàng Loạt
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition shadow-md"
            >
              <Plus size={15} />
              Thêm Sản Phẩm
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={Layers}
            label="Tổng SKU"
            value={String(variants.length)}
            sub="↑ +12% tháng này"
            subColor="text-emerald-500"
          />
          <MetricCard
            icon={AlertCircle}
            label="Tồn Kho Thấp"
            value={String(lowStockCount)}
            sub="Cần xử lý ngay"
            subColor="text-rose-500"
          />
          <MetricCard
            icon={Clock}
            label="Thời Gian Chờ"
            value="8.2 ngày"
            sub="● Đã tối ưu"
            subColor="text-teal-500"
          />
          <MetricCard
            icon={TrendingUp}
            label="Biến Thể Hoạt Động"
            value={String(variants.length)}
            sub="Trên nhiều kiểu gọng"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Filter Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Lọc theo:
              </span>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Dòng Acetate
                <ChevronDown size={14} />
              </button>
              <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
                <SlidersHorizontal size={14} />
              </button>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Hiển thị {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, variants.length)}{" "}
              trong {variants.length} biến thể
            </span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[2rem_2fr_1fr_1.2fr_1fr_1.1fr_1fr_1.5fr_auto] items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
            <input
              type="checkbox"
              checked={allPageSelected}
              onChange={toggleAll}
              className="accent-teal-600 w-4 h-4 rounded"
            />
            {[
              "Chi Tiết Biến Thể",
              "Chất Liệu",
              "Màu Sắc",
              "Cỡ / Cầu",
              "Mã SKU",
              "Tồn Kho",
              "Đơn Giá",
              "Điều Chỉnh",
            ].map((h, i) => (
              <span
                key={i}
                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {pageVariants.map((v, i) => (
            <div
              key={v.id}
              className={`grid grid-cols-[2rem_2fr_1fr_1.2fr_1fr_1.1fr_1fr_1.5fr_auto] items-center gap-3 px-5 py-4 transition hover:bg-slate-50 ${
                i !== pageVariants.length - 1 ? "border-b border-slate-100" : ""
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
                <p className="text-[10px] text-slate-400">Cầu Chuẩn</p>
              </div>

              {/* SKU */}
              <div className="font-mono text-[10px] text-slate-500 leading-relaxed">
                {v.skuId.split("-").map((seg, i) => (
                  <span key={i} className="block">
                    {seg}
                  </span>
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

              {/* Stock Controls + Delete */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => changeStock(v.id, -1)}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-500 hover:text-rose-600 transition flex items-center justify-center"
                  title="Giảm 1"
                >
                  <Minus size={12} />
                </button>
                <button
                  onClick={() => changeStock(v.id, 1)}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-500 hover:text-emerald-600 transition flex items-center justify-center"
                  title="Tăng 1"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={() => deleteVariant(v.id)}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-500 hover:text-rose-600 transition flex items-center justify-center ml-1"
                  title="Xóa sản phẩm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {variants.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              Chưa có sản phẩm nào. Nhấn "Thêm Sản Phẩm" để bắt đầu.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-1">
              <button
                onClick={() => goPage(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-slate-500"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => goPage(n)}
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
                onClick={() => goPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-slate-500"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Đến trang</span>
              <input
                type="number"
                value={goTo}
                min={1}
                max={totalPages}
                onChange={(e) => setGoTo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = parseInt(goTo);
                    if (n >= 1 && n <= totalPages) goPage(n);
                  }
                }}
                className="w-12 text-center border border-slate-200 rounded-lg py-1 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSave={handleAddProduct}
        />
      )}
    </div>
  );
}