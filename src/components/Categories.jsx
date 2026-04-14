const categories = [
  { icon: "👓", name: "Kính cận", count: "45 sản phẩm" },
  { icon: "🕶️", name: "Kính râm", count: "32 sản phẩm" },
  { icon: "✨", name: "Kính thời trang", count: "28 sản phẩm" },
  { icon: "🧒", name: "Kính trẻ em", count: "15 sản phẩm" },
  { icon: "🏃", name: "Kính thể thao", count: "12 sản phẩm" },
  { icon: "🔍", name: "Tròng kính", count: "20 sản phẩm" },
];

function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-900">Danh mục sản phẩm</h2>
        <p className="mt-3 text-lg text-slate-500">
          Khám phá các loại kính mắt phù hợp với bạn
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
        {categories.map((item) => (
          <div
            key={item.name}
            className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">{item.icon}</div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              {item.name}
            </h3>
            <p className="mt-2 text-slate-500">{item.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;