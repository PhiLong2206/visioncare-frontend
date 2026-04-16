import React from 'react';
import { 
  Search, 
  Plus, 
  SquarePen, 
  Trash2 
} from 'lucide-react';

interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  price: string;
  status: 'Còn hàng' | 'Đặt trước';
}

const products: Product[] = [
  { id: 1, image: 'https://via.placeholder.com/40', name: 'Classic Aviator Gold', category: 'Gọng kính cận', price: '850.000 ₫', status: 'Còn hàng' },
  { id: 2, image: 'https://via.placeholder.com/40', name: 'Modern Square Black', category: 'Gọng kính cận', price: '690.000 ₫', status: 'Còn hàng' },
  { id: 3, image: 'https://via.placeholder.com/40', name: 'Elegant Cat-Eye Rose', category: 'Gọng kính thời trang', price: '950.000 ₫', status: 'Còn hàng' },
  { id: 4, image: 'https://via.placeholder.com/40', name: 'Titanium Rimless Pro', category: 'Gọng kính cận', price: '1.400.000 ₫', status: 'Đặt trước' },
  { id: 5, image: 'https://via.placeholder.com/40', name: 'Ultra Light Rectangle', category: 'Gọng kính cận', price: '520.000 ₫', status: 'Còn hàng' },
];

const ProductManagement = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý sản phẩm</h1>
          <p className="text-gray-500 text-sm">18 sản phẩm</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium">
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-xs">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-sm"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-50">
              <th className="px-6 py-4 font-medium">Ảnh</th>
              <th className="px-6 py-4 font-medium">Tên</th>
              <th className="px-6 py-4 font-medium">Danh mục</th>
              <th className="px-6 py-4 font-medium">Giá</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700 text-sm">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {product.category}
                </td>
                <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                  {product.price}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'Còn hàng' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-orange-50 text-orange-500'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3 text-gray-400">
                    <button className="hover:text-teal-600 transition-colors">
                      <SquarePen size={18} />
                    </button>
                    <button className="hover:text-red-500 transition-colors">
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
  );
};

export default ProductManagement;