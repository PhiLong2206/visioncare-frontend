import { useState, useEffect } from "react";
import { FileText, Plus, Edit3, Trash2, Search, ExternalLink, Eye, Globe } from "lucide-react";
import toast from "react-hot-toast";

// Giả lập API cho CMS (Sau này bạn có thể bổ sung Controller CmsPages tương tự AdminController)
const mockCmsPages = [
  { id: 1, title: "Về chúng tôi", slug: "about-us", status: "Published", updatedAt: "2024-03-20" },
  { id: 2, title: "Chính sách bảo mật", slug: "privacy-policy", status: "Published", updatedAt: "2024-03-18" },
  { id: 3, title: "Điều khoản dịch vụ", slug: "terms-of-service", status: "Draft", updatedAt: "2024-03-15" },
];

export default function CmsConfig() {
  const [pages, setPages] = useState(mockCmsPages);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa trang này?")) {
        setPages(pages.filter(p => p.id !== id));
        toast.success("Đã xóa trang thành công");
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Quản lý nội dung (CMS)</h1>
          <p className="mt-1 text-[16px] text-slate-500">Tùy chỉnh các trang tĩnh và nội dung văn bản trên hệ thống</p>
        </div>

        <button 
          onClick={() => toast.success("Mở trình soạn thảo văn bản...")}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-[14px] font-bold text-white shadow-lg transition hover:bg-slate-800"
        >
          <Plus size={18} />
          <span>Tạo trang mới</span>
        </button>
      </div>

      <div className="mb-6 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text"
          placeholder="Tìm kiếm tiêu đề trang hoặc slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-cyan-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page.id} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition">
                    <FileText size={24} />
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                    page.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                }`}>
                    {page.status}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{page.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-400">
                <Globe size={14} />
                <span>/{page.slug}</span>
            </div>

            <p className="mt-4 text-[12px] text-slate-400">Cập nhật lần cuối: {page.updatedAt}</p>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-2">
                    <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-cyan-600 transition">
                        <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(page.id)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-rose-600 transition">
                        <Trash2 size={18} />
                    </button>
                </div>
                <button className="flex items-center gap-1 text-[13px] font-bold text-slate-600 hover:text-slate-900 transition">
                    <span>Xem trước</span>
                    <ExternalLink size={14} />
                </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
