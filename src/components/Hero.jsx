import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1511499767150-a48a237f0083"
        alt="VisionCare Hero"
        className="absolute h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/20"></div>

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-xl text-white">
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
            Bộ sưu tập mới 2026
          </span>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            Tìm kiếm kính mắt <br />
            hoàn hảo cho bạn
          </h1>

          <p className="mt-4 text-lg text-gray-200">
            Khám phá bộ sưu tập kính mắt cao cấp. Mua kính có sẵn,
            đặt trước hoặc làm kính theo toa.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-100"
            >
              Mua sắm ngay
            </button>

            <button
              type="button"
              onClick={() => navigate("/products?type=prescription")}
              className="rounded-xl border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-900"
            >
              Kính theo toa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;