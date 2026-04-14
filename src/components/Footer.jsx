import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-20 bg-[#071b2f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-text-sm font-bold text-white">
                VC
              </div>
              <span className="text-2xl font-bold">VisionCare</span>
            </Link>

            <p className="mt-6 max-w-xs text-base leading-8 text-slate-300">
              Hệ thống bán kính mắt trực tuyến hàng đầu Việt Nam. Chất lượng -
              Uy tín - Chuyên nghiệp.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">Sản phẩm</h3>
            <ul className="mt-6 space-y-4 text-base text-slate-300">
              <li>
                <Link to="/products" className="transition hover:text-white">
                  Kính cận
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition hover:text-white">
                  Kính râm
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition hover:text-white">
                  Kính thời trang
                </Link>
              </li>
              <li>
                <Link to="/products" className="transition hover:text-white">
                  Tròng kính
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold">Hỗ trợ</h3>
            <ul className="mt-6 space-y-4 text-base text-slate-300">
              <li>
                <span className="transition hover:text-white">
                  Hướng dẫn mua hàng
                </span>
              </li>
              <li>
                <span className="transition hover:text-white">
                  Chính sách đổi trả
                </span>
              </li>
              <li>
                <span className="transition hover:text-white">Bảo hành</span>
              </li>
              <li>
                <span className="transition hover:text-white">FAQ</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold">Liên hệ</h3>
            <ul className="mt-6 space-y-4 text-base text-slate-300">
              <li className="flex items-center gap-3">
                <span>📞</span>
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <span>✉️</span>
                <span>contact@visioncare.vn</span>
              </li>
              <li className="flex items-start gap-3">
                <span>📍</span>
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
          © 2026 VisionCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;