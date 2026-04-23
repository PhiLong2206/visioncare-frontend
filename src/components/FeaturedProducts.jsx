import { Link } from "react-router-dom";
import { products } from "../data/products";

function FeaturedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Sản phẩm nổi bật
          </h2>
          <p className="text-slate-500">Được yêu thích nhất</p>
        </div>

        <span className="cursor-pointer font-semibold text-teal-600">
          Xem tất cả →
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            className="block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative h-60 overflow-hidden">
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

              <p className="mt-2 text-sm text-slate-500">
                {item.color} · {item.size}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;