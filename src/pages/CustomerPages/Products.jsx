import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PRODUCT_API = "/api/Product";

const categories = [
  "Tất cả",
  "Kính cận",
  "Kính râm",
  "Kính thời trang",
  "Gọng Kính",
];

function mapCategory(apiCategory = "") {
  const value = String(apiCategory).toLowerCase();

  if (
    value.includes("tròn") ||
    value.includes("vuông") ||
    value.includes("cat-eye") ||
    value.includes("gọng")
  ) {
    return "Gọng Kính";
  }

  if (value.includes("râm") || value.includes("mát")) {
    return "Kính râm";
  }

  return "Kính cận";
}

function normalizeProduct(item) {
  const firstVariant = Array.isArray(item?.productVariants)
    ? item.productVariants[0]
    : null;

  return {
    id: item?.productId,
    productName: item?.productName || "Sản phẩm",
    categoryName: item?.category?.categoryName || "",
    mappedCategory: mapCategory(item?.category?.categoryName || ""),
    price: Number(item?.minPrice ?? item?.basePrice ?? 0),
    oldPrice:
      Number(item?.basePrice ?? 0) > Number(item?.minPrice ?? 0)
        ? Number(item.basePrice)
        : null,
    image:
      item?.image2D ||
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    stock: Number(item?.totalStock ?? 0),
    color: firstVariant?.color || "Nhiều màu",
    size: firstVariant?.size || "M",
    rating: 4.8,
    reviews: 12,
    isPreOrder: Boolean(item?.isPreOrder),
  };
}

function getAvailability(item) {
  const isOutOfStock = Number(item.stock || 0) === 0;

  if (isOutOfStock && item.isPreOrder) {
    return {
      label: "Hết hàng - đặt trước",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }

  if (isOutOfStock) {
    return {
      label: "Hết hàng",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    };
  }

  return {
    label: "Có sẵn",
    className: "bg-green-50 text-green-700 border-green-200",
  };
}

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(PRODUCT_API);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log("API:", data);

        const rawProducts = Array.isArray(data?.data) ? data.data : [];
        const normalizedProducts = rawProducts.map(normalizeProduct);

        setProducts(normalizedProducts);
      } catch (err) {
        console.error("FetchProducts error:", err);
        setError("Không tải được sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveCategory("Tất cả");
    setSortOption("default");
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const name = (item.productName || "").toLowerCase();
      const category = (item.categoryName || "").toLowerCase();
      const mappedCategory = (item.mappedCategory || "").toLowerCase();
      const keyword = searchTerm.trim().toLowerCase();

      const matchCategory =
        activeCategory === "Tất cả" ||
        mappedCategory === activeCategory.toLowerCase();

      const matchSearch =
        name.includes(keyword) ||
        category.includes(keyword) ||
        mappedCategory.includes(keyword) ||
        (item.color || "").toLowerCase().includes(keyword);

      return matchCategory && matchSearch;
    });

    if (sortOption === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      result = [...result].sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );
    } else if (sortOption === "rating-desc") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchTerm, activeCategory, sortOption]);

  if (loading) {
    return <div className="py-20 text-center">Đang tải sản phẩm...</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Sản phẩm</h1>
        <p className="text-slate-500">
          Khám phá các mẫu kính nổi bật của VisionCare
        </p>
      </div>

      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
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

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === c
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
          {filteredProducts.map((item) => {
            const availability = getAvailability(item);

            return (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-60 overflow-hidden bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />

                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${availability.className}`}
                    >
                      {availability.label}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-slate-500">{item.mappedCategory}</p>

                  <h3 className="mt-1 min-h-[56px] text-lg font-semibold text-slate-900">
                    {item.productName}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {item.price.toLocaleString("vi-VN")} đ
                    </span>

                    {item.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {item.oldPrice.toLocaleString("vi-VN")} đ
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-yellow-500">
                      ⭐ {item.rating.toFixed(1)}
                    </span>
                    <span>({item.reviews} đánh giá)</span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.color} · {item.size}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Products;