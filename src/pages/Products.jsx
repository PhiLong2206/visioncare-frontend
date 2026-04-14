import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";

const categories = ["Tất cả", "Kính cận", "Kính râm", "Kính thời trang", "Gọng Kính"];

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [sortOption, setSortOption] = useState("default");

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveCategory("Tất cả");
    setSortOption("default");
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const matchCategory =
        activeCategory === "Tất cả" || item.category === activeCategory;

      const keyword = searchTerm.trim().toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.frameType.toLowerCase().includes(keyword) ||
        item.color.toLowerCase().includes(keyword);

      return matchCategory && matchSearch;
    });

    if (sortOption === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "rating-desc") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchTerm, activeCategory, sortOption]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Sản phẩm</h1>
        <p className="mt-2 text-slate-500">
          Khám phá các mẫu kính nổi bật của VisionCare
        </p>
      </div>

      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Tìm kính theo tên, màu sắc, kiểu dáng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <div className="w-full lg:w-[240px]">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="name-asc">Tên A - Z</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Reset bộ lọc
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 text-sm text-slate-500">
        Tìm thấy{" "}
        <span className="font-semibold text-slate-900">
          {filteredProducts.length}
        </span>{" "}
        sản phẩm
      </div>

      {filteredProducts.length === 0 ? (
       <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm">
  <div className="text-5xl">🔍</div>

  <h2 className="mt-4 text-2xl font-bold text-slate-900">
    Không tìm thấy sản phẩm
  </h2>

  <p className="mt-2 text-slate-500">
    Thử thay đổi từ khóa hoặc bộ lọc
  </p>

  <button
    onClick={handleResetFilters}
    className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-white hover:opacity-90"
  >
    Reset bộ lọc
  </button>
</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-60 overflow-hidden bg-slate-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />

                {item.discount && (
                  <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
                    {item.discount}
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="text-sm text-slate-500">
                  {item.category}
                  {item.frameType ? ` · ${item.frameType}` : ""}
                </p>

                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {item.name}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-teal-600">
                    {item.price.toLocaleString("vi-VN")} đ
                  </span>

                  {item.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {item.oldPrice.toLocaleString("vi-VN")} đ
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <span className="text-yellow-500">⭐ {item.rating}</span>
                  <span>({item.reviews} đánh giá)</span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {item.color} · {item.size}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;