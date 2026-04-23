import { useState } from "react";
import { Image as ImageIcon, Upload, Search, Trash2, Filter, Grid, List as ListIcon, FileIcon, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const mockImages = [
  { id: 1, name: "banner-summer.jpg", size: "1.2 MB", type: "image/jpeg", url: "https://images.unsplash.com/photo-1511499767390-a73c2f61efcb?w=400&auto=format&fit=crop&q=60" },
  { id: 2, name: "logo-white.png", size: "450 KB", type: "image/png", url: "https://plus.unsplash.com/premium_photo-1663100722417-6e36673fe0ed?w=400&auto=format&fit=crop&q=60" },
  { id: 3, name: "product-glasses-01.webp", size: "890 KB", type: "image/webp", url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=60" },
  { id: 4, name: "icon-shipping.svg", size: "12 KB", type: "image/svg+xml", url: "https://images.unsplash.com/photo-1509100104048-d3c74893c501?w=400&auto=format&fit=crop&q=60" },
];

export default function MediaLibrary() {
  const [images, setImages] = useState(mockImages);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
        setIsUploading(false);
        toast.success("Tải tệp tin lên thành công!");
    }, 2000);
  };

  const handleDelete = (id) => {
    setImages(images.filter(img => img.id !== id));
    toast.success("Đã xóa tệp tin khỏi thư viện");
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Thư viện tài nguyên</h1>
          <p className="mt-1 text-[16px] text-slate-500">Quản lý hình ảnh, video và các tài liệu trên website</p>
        </div>

        <button 
          onClick={handleUpload}
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-50"
        >
          <Upload size={18} />
          <span>{isUploading ? "Đang tải lên..." : "Tải tệp mới"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm tệp tin..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex border border-slate-200 rounded-2xl bg-white p-1">
                  <button className="p-2 rounded-xl bg-slate-100 text-slate-900"><Grid size={18} /></button>
                  <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50"><ListIcon size={18} /></button>
              </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img) => (
                <div 
                    key={img.id}
                    onClick={() => setSelectedId(img.id)}
                    className={`group relative aspect-square rounded-3xl border-2 overflow-hidden cursor-pointer transition-all ${
                        selectedId === img.id ? 'border-cyan-500 ring-4 ring-cyan-500/10' : 'border-transparent bg-slate-100'
                    }`}
                >
                    <img src={img.url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }} className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-rose-500 transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                    {selectedId === img.id && (
                        <div className="absolute top-3 right-3 text-cyan-500 bg-white rounded-full">
                            <CheckCircle2 size={24} fill="currentColor" className="text-white" />
                        </div>
                    )}
                </div>
            ))}
          </div>
        </div>

        {/* Sidebar Detail */}
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Chi tiết tệp tin</h3>
                {selectedId ? (
                    <div className="space-y-4">
                        <div className="aspect-video rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                            <img src={images.find(i => i.id === selectedId)?.url} alt="" className="h-full w-full object-contain" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 truncate">{images.find(i => i.id === selectedId)?.name}</p>
                            <p className="text-xs text-slate-500">{images.find(i => i.id === selectedId)?.size} • {images.find(i => i.id === selectedId)?.type}</p>
                        </div>
                        <div className="pt-4 space-y-3">
                            <button className="w-full h-11 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition">Sao chép Link</button>
                            <button onClick={() => handleDelete(selectedId)} className="w-full h-11 bg-rose-50 text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-100 transition">Xóa vĩnh viễn</button>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center space-y-4">
                        <div className="h-16 w-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                            <FileIcon size={32} />
                        </div>
                        <p className="text-sm text-slate-400">Chọn một tệp tin để xem chi tiết</p>
                    </div>
                )}
            </div>

            <div className="rounded-3xl bg-cyan-900 p-8 text-white">
                <h3 className="font-bold mb-2">Tối ưu hóa tự động</h3>
                <p className="text-xs text-cyan-200/70 leading-relaxed">
                    Hệ thống VisionCare tự động nén và chuyển đổi hình ảnh sang định dạng WebP để tăng tốc độ tải trang lên đến 40%.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
}
