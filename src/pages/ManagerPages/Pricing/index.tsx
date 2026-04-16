import { useState } from "react";

// --- Types ---
type Tab = "gia-gong" | "gia-trong" | "combo" | "khuyen-mai";

interface FramePrice {
  id: number;
  name: string;
  price: number;
}

interface LensPrice {
  id: number;
  name: string;
  price: number;
}

interface ComboPrice {
  id: number;
  name: string;
  includes: string;
  price: number;
}

interface Promotion {
  id: number;
  name: string;
  code: string;
  discount: string;
  active: boolean;
}

// --- Data ---
const framePrices: FramePrice[] = [
  { id: 1, name: "Full-rim Acetate", price: 350000 },
  { id: 2, name: "Full-rim Kim loại", price: 450000 },
  { id: 3, name: "Half-rim", price: 400000 },
  { id: 4, name: "Rimless Titanium", price: 600000 },
  { id: 5, name: "TR90", price: 250000 },
];

const lensPrices: LensPrice[] = [
  { id: 1, name: "Tròng đơn tròng (Single Vision)", price: 300000 },
  { id: 2, name: "Tròng hai tròng (Bifocal)", price: 600000 },
  { id: 3, name: "Tròng đa tròng (Progressive)", price: 900000 },
  { id: 4, name: "Tròng chống ánh sáng xanh", price: 450000 },
  { id: 5, name: "Tròng đổi màu (Photochromic)", price: 750000 },
];

const comboPrices: ComboPrice[] = [
  { id: 1, name: "Combo Cận cơ bản", includes: "Gọng + Tròng đơn tròng", price: 590000 },
  { id: 2, name: "Combo Cận cao cấp", includes: "Gọng + Tròng chống ánh sáng xanh", price: 890000 },
  { id: 3, name: "Combo Progressive", includes: "Gọng + Tròng đa tròng", price: 1290000 },
];

const initialPromotions: Promotion[] = [
  { id: 1, name: "Giảm 20% kính râm", code: "SUMMER20", discount: "20%", active: true },
  { id: 2, name: "Giảm 100K đơn từ 1M", code: "SAVE100", discount: "100,000đ", active: true },
  { id: 3, name: "Freeship toàn quốc", code: "FREESHIP", discount: "Free ship", active: false },
];

// --- Helpers ---
function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + " đ";
}

// --- Edit Modal ---
function EditModal({
  label,
  value,
  onSave,
  onClose,
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [val, setVal] = useState(value);
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-800">Sửa {label}</h3>
        <input
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={() => { onSave(val); onClose(); }}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Tab: Giá gọng ---
function GiaGong() {
  const [items, setItems] = useState(framePrices);
  const [editing, setEditing] = useState<{ id: number; field: "name" | "price"; value: string } | null>(null);

  const handleSave = (val: string) => {
    if (!editing) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editing.id
          ? { ...item, [editing.field]: editing.field === "price" ? Number(val.replace(/\D/g, "")) : val }
          : item
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {editing && (
        <EditModal
          label={editing.field === "name" ? "tên gọng" : "giá"}
          value={editing.value}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
      {/* Header */}
      <div className="grid grid-cols-[1fr_180px_100px] gap-4 px-6 py-3 border-b border-slate-100">
        <span className="text-sm text-slate-400">Loại gọng</span>
        <span className="text-sm text-slate-400">Giá</span>
        <span className="text-sm text-slate-400 text-right">Thao tác</span>
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`grid grid-cols-[1fr_180px_100px] gap-4 items-center px-6 py-5 hover:bg-slate-50 transition ${
            i !== items.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <span className="text-sm font-semibold text-slate-800">{item.name}</span>
          <span className="text-sm text-slate-700">{formatVND(item.price)}</span>
          <div className="text-right">
            <button
              onClick={() => setEditing({ id: item.id, field: "price", value: String(item.price) })}
              className="text-sm font-bold text-slate-800 hover:text-teal-600 transition"
            >
              Sửa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Tab: Giá tròng ---
function GiaTrong() {
  const [items, setItems] = useState(lensPrices);
  const [editing, setEditing] = useState<{ id: number; value: string } | null>(null);

  const handleSave = (val: string) => {
    if (!editing) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editing.id ? { ...item, price: Number(val.replace(/\D/g, "")) } : item
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {editing && (
        <EditModal
          label="giá tròng"
          value={editing.value}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
      <div className="grid grid-cols-[1fr_180px_100px] gap-4 px-6 py-3 border-b border-slate-100">
        <span className="text-sm text-slate-400">Loại tròng</span>
        <span className="text-sm text-slate-400">Giá</span>
        <span className="text-sm text-slate-400 text-right">Thao tác</span>
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`grid grid-cols-[1fr_180px_100px] gap-4 items-center px-6 py-5 hover:bg-slate-50 transition ${
            i !== items.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <span className="text-sm font-semibold text-slate-800">{item.name}</span>
          <span className="text-sm text-slate-700">{formatVND(item.price)}</span>
          <div className="text-right">
            <button
              onClick={() => setEditing({ id: item.id, value: String(item.price) })}
              className="text-sm font-bold text-slate-800 hover:text-teal-600 transition"
            >
              Sửa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Tab: Combo ---
function Combo() {
  const [items, setItems] = useState(comboPrices);
  const [editing, setEditing] = useState<{ id: number; value: string } | null>(null);

  const handleSave = (val: string) => {
    if (!editing) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editing.id ? { ...item, price: Number(val.replace(/\D/g, "")) } : item
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {editing && (
        <EditModal
          label="giá combo"
          value={editing.value}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
      <div className="grid grid-cols-[1.2fr_1fr_180px_100px] gap-4 px-6 py-3 border-b border-slate-100">
        <span className="text-sm text-slate-400">Tên combo</span>
        <span className="text-sm text-slate-400">Bao gồm</span>
        <span className="text-sm text-slate-400">Giá</span>
        <span className="text-sm text-slate-400 text-right">Thao tác</span>
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`grid grid-cols-[1.2fr_1fr_180px_100px] gap-4 items-center px-6 py-5 hover:bg-slate-50 transition ${
            i !== items.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <span className="text-sm font-semibold text-slate-800">{item.name}</span>
          <span className="text-sm text-slate-400">{item.includes}</span>
          <span className="text-sm text-slate-700">{formatVND(item.price)}</span>
          <div className="text-right">
            <button
              onClick={() => setEditing({ id: item.id, value: String(item.price) })}
              className="text-sm font-bold text-slate-800 hover:text-teal-600 transition"
            >
              Sửa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Tab: Khuyến mãi ---
function KhuyenMai() {
  const [items, setItems] = useState(initialPromotions);

  const toggleActive = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_100px] gap-4 px-6 py-3 border-b border-slate-100">
        <span className="text-sm text-slate-400">Tên</span>
        <span className="text-sm text-slate-400">Mã</span>
        <span className="text-sm text-slate-400">Giảm giá</span>
        <span className="text-sm text-slate-400">Trạng thái</span>
        <span className="text-sm text-slate-400 text-right">Thao tác</span>
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_100px] gap-4 items-center px-6 py-5 hover:bg-slate-50 transition ${
            i !== items.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <span className="text-sm font-semibold text-slate-800">{item.name}</span>
          <span>
            <span className="inline-block font-mono text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-semibold tracking-wide">
              {item.code}
            </span>
          </span>
          <span className="text-sm text-slate-700">{item.discount}</span>
          <button onClick={() => toggleActive(item.id)} className="text-left">
            <span
              className={`text-sm font-semibold transition ${
                item.active ? "text-teal-500" : "text-slate-400"
              }`}
            >
              {item.active ? "Đang hoạt động" : "Tạm dừng"}
            </span>
          </button>
          <div className="text-right">
            <button className="text-sm font-bold text-slate-800 hover:text-teal-600 transition">
              Sửa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Tab config ---
const tabs: { key: Tab; label: string }[] = [
  { key: "gia-gong", label: "Giá gọng" },
  { key: "gia-trong", label: "Giá tròng" },
  { key: "combo", label: "Combo" },
  { key: "khuyen-mai", label: "Khuyến mãi" },
];

// --- Main ---
export default function Pricing() {
  const [activeTab, setActiveTab] = useState<Tab>("gia-gong");

  return (
    <div className="overflow-y-auto bg-slate-50 font-sans p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản lý giá
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý giá gọng, tròng, combo và khuyến mãi
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "gia-gong" && <GiaGong />}
          {activeTab === "gia-trong" && <GiaTrong />}
          {activeTab === "combo" && <Combo />}
          {activeTab === "khuyen-mai" && <KhuyenMai />}
        </div>

      </div>
    </div>
  );
}