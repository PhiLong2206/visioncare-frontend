function BenefitItem({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function Benefits() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <BenefitItem
          icon="🚚"
          title="Miễn phí vận chuyển"
          desc="Đơn hàng từ 2 triệu"
        />
        <BenefitItem
          icon="🛡️"
          title="Bảo hành 12 tháng"
          desc="Đổi trả trong 30 ngày"
        />
        <BenefitItem
          icon="🎧"
          title="Hỗ trợ 24/7"
          desc="Tư vấn chuyên nghiệp"
        />
      </div>
    </section>
  );
}

export default Benefits;