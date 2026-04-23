import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  SquarePen, 
  Trash2,
  X,
  PackageSearch,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../components/ConfirmModal';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../api/managerProductAPI';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
};

interface Product {
  id?: number;
  productId?: number;
  productName: string;
  brand?: string;
  categoryId: number;
  basePrice: number;
  description?: string;
  image2D?: string;
  isPreOrder: boolean;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    action: () => {},
  });

  const defaultForm = {
    productName: '',
    brand: '',
    categoryId: 1,
    basePrice: '',
    description: '',
    image2D: '',
    isPreOrder: false
  };

  const [formData, setFormData] = useState(defaultForm);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      productName: product.productName,
      brand: product.brand || '',
      categoryId: product.categoryId || 1,
      basePrice: String(product.basePrice),
      description: product.description || '',
      image2D: product.image2D || '',
      isPreOrder: product.isPreOrder || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa sản phẩm",
      message: "Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này có thể bị từ chối nếu sản phẩm đã có dữ liệu liên kết.",
      confirmText: "Xác nhận xóa",
      action: async () => {
        try {
          setLoading(true);
          await deleteProduct(id);
          toast.success('Xóa sản phẩm thành công');
          fetchProducts();
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.basePrice) {
      toast.error('Vui lòng nhập tên và giá sản phẩm');
      return;
    }

    if (Number(formData.basePrice) < 0) {
      toast.error('Giá sản phẩm không được là số âm');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        categoryId: Number(formData.categoryId)
      };

      if (modalMode === 'create') {
        await createProduct(payload);
        toast.success('Thêm sản phẩm thành công');
      } else if (selectedProduct) {
        const id = selectedProduct.id || selectedProduct.productId;
        if (id) {
          await updateProduct(id, payload);
          toast.success('Cập nhật sản phẩm thành công');
        }
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Sản phẩm</h1>
          <p className="text-slate-500 mt-2 text-lg">{products.length} sản phẩm trong hệ thống</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-slate-200 font-bold"
        >
          <Plus size={20} />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
          <Search size={20} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên hoặc thương hiệu..."
          className="block w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 bg-white font-medium text-slate-700 transition-all shadow-sm"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-8 py-6 font-semibold">Sản phẩm</th>
                <th className="px-8 py-6 font-semibold">Thương hiệu</th>
                <th className="px-8 py-6 font-semibold">Phân loại</th>
                <th className="px-8 py-6 font-semibold">Giá cơ bản</th>
                <th className="px-8 py-6 font-semibold">Pre-order</th>
                <th className="px-8 py-6 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <PackageSearch size={40} className="text-slate-300" />
                      <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id || product.productId} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400">
                        {product.image2D ? (
                          <img src={product.image2D} alt={product.productName} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={24} />
                        )}
                      </div>
                      <span className="font-bold text-slate-900">{product.productName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-medium text-slate-600">
                    {product.brand || 'Khác'}
                  </td>
                  <td className="px-8 py-6 text-slate-500">
                    {product.categoryId === 1 ? 'Gọng kính' : product.categoryId === 2 ? 'Tròng kính' : 'Phụ kiện'}
                  </td>
                  <td className="px-8 py-6 font-extrabold text-slate-900">
                    {formatCurrency(product.basePrice)}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider border ${
                      product.isPreOrder 
                        ? 'bg-purple-50 text-purple-600 border-purple-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {product.isPreOrder ? 'Có hỗ trợ' : 'Không'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEditModal(product)}
                        className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                      >
                        <SquarePen size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          const id = product.id || product.productId;
                          if (id) handleDelete(id);
                        }}
                        className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-8 border-b border-slate-50">
              <h2 className="text-2xl font-bold text-slate-900">
                {modalMode === 'create' ? 'Thêm Sản phẩm mới' : 'Cập nhật Sản phẩm'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 hover:bg-slate-100 text-slate-400 transition">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all font-medium text-slate-700"
                    placeholder="VD: Kính râm RayBan Aviator"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Thương hiệu</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-cyan-500 outline-none transition-all font-medium"
                    placeholder="VD: RayBan"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Giá cơ bản (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-cyan-500 outline-none transition-all font-medium font-mono text-slate-800 text-lg"
                    placeholder="0"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">Link Ảnh (Image URL)</label>
                  <input
                    type="text"
                    value={formData.image2D}
                    onChange={(e) => setFormData({...formData, image2D: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-cyan-500 outline-none transition-all text-sm text-slate-600"
                    placeholder="https://example.com/image.png"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">Mô tả sản phẩm</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-cyan-500 outline-none transition-all font-medium text-slate-600 resize-none"
                    placeholder="Nhập mô tả chi tiết..."
                  />
                </div>

                <div className="col-span-2 border-t border-slate-100 pt-6 mt-2">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Phân loại & Thuộc tính</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                      className="p-4 border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-slate-700 bg-white"
                    >
                      <option value={1}>Gọng kính</option>
                      <option value={2}>Tròng kính</option>
                      <option value={3}>Phụ kiện</option>
                    </select>
                    
                    <label className="flex items-center gap-3 p-4 border-2 border-purple-100 rounded-xl cursor-pointer hover:border-purple-200 transition-all has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-purple-600 rounded border-purple-300 focus:ring-purple-500" 
                        checked={formData.isPreOrder}
                        onChange={(e) => setFormData({...formData, isPreOrder: e.target.checked})}
                      />
                      <span className="font-bold text-slate-700">Cho Pre-order</span>
                    </label>
                  </div>
                  {modalMode === 'create' && (
                    <p className="text-xs text-amber-600 font-bold bg-amber-50 p-3 rounded-lg mt-4 border border-amber-200">
                      ⚠ Hệ thống sẽ tự động tạo một phiên bản (Variant) "Mặc định" cho sản phẩm mới này để hỗ trợ nhập kho.
                    </p>
                  )}
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-slate-50 flex justify-end gap-4 bg-slate-50/50">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                <Save size={20} />
                {isSubmitting ? "Đang lưu..." : "Lưu Sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          setConfirmModal({ ...confirmModal, isOpen: false });
          confirmModal.action();
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />
    </div>
  );
};

export default ProductManagement;