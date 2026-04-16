import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Send,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  FileText,
  MessageSquare,
} from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-6 text-slate-800">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <button
              onClick={() => navigate("/staff")}
              className="rounded-lg p-1 transition hover:bg-slate-200"
            >
              <ChevronLeft size={18} />
            </button>
  <Link
  to="/staff"
  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
>
  <ChevronLeft size={16} />
  Quay lại
</Link>
            <ChevronRight size={14} />
            <span>#{id || "VC-88291"}</span>
          </div>

          <h1 className="text-[30px] font-bold tracking-tight text-slate-900">
            Xem lại chỉ số toa kính
          </h1>

          <p className="mt-2 text-[15px] text-slate-500">
            Kiểm tra, xác nhận và chuyển thông tin toa cho bộ phận vận hành.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            <span>Xác nhận và gửi cho bộ phận vận hành</span>
            <Send size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-3">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                <User size={24} />
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Julianne Sterling
            </h2>
            <p className="mb-6 mt-1 text-sm text-slate-500">
              Mã bệnh nhân: #PS-4492-B
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Mail size={16} className="text-slate-400" />
                <span>j.sterling@example.com</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone size={16} className="text-slate-400" />
                <span>+1 (555) 012-3456</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-700">
                <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <span>1282 Oakwood Ave, San Francisco, CA</span>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              <ShoppingCart size={16} />
              <span>Thông tin đơn hàng</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Mẫu gọng kính</span>
                <span className="text-right font-semibold text-slate-900">
                  Aura Modern Rectangular - Matte Black
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Chất liệu tròng</span>
                <span className="text-right font-semibold text-slate-900">
                  1.67 High-Index Clear
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Lớp phủ</span>
                <span className="text-right font-semibold text-slate-900">
                  Blue Light + Anti-Glare
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="font-bold text-slate-900">Tổng</span>
                <span className="text-xl font-bold text-teal-600">
                  429.000 VND
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              <FileText size={16} />
              <span>Trạng thái xử lý</span>
            </div>

            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
                Chờ staff xác nhận
              </div>

              <p className="text-sm leading-6 text-slate-600">
                Staff kiểm tra lại thông tin OCR, chỉnh sửa nếu cần và gửi sang
                bộ phận Operation để xử lý đơn.
              </p>
            </div>
          </section>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-9">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Dữ liệu chỉ số được trích xuất
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Kiểm tra kết quả OCR và chỉnh sửa thông số trước khi xác nhận.
                </p>
              </div>

              <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-teal-600 transition hover:bg-slate-200">
                <RotateCcw size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="hidden grid-cols-6 gap-4 px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 md:grid">
                <div />
                <div>Độ cầu (SPH)</div>
                <div>Độ loạn (CYL)</div>
                <div>Trục loạn</div>
                <div>Độ thêm</div>
                <div>Lăng kính</div>
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4 md:grid-cols-6 md:items-center">
                <div className="flex flex-col items-center">
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xs font-bold text-white">
                    OD
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-teal-600">
                    Mắt phải
                  </span>
                </div>

                <input
                  type="text"
                  defaultValue="-2.50"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold outline-none transition focus:border-teal-400"
                />
                <input
                  type="text"
                  defaultValue="-0.75"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold outline-none transition focus:border-teal-400"
                />
                <input
                  type="text"
                  defaultValue="165"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold outline-none transition focus:border-teal-400"
                />
                <input
                  type="text"
                  defaultValue="+2.25"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold outline-none transition focus:border-teal-400"
                />
                <input
                  type="text"
                  defaultValue="None"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center text-slate-400 outline-none transition focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4 md:grid-cols-6 md:items-center">
                <div className="flex flex-col items-center">
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-xs font-bold text-white">
                    OS
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-cyan-600">
                    Mắt trái
                  </span>
                </div>

                <input
                  type="text"
                  defaultValue="-2.25"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold outline-none transition focus:border-teal-400"
                />
                <input
                  type="text"
                  defaultValue="-1.00"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold outline-none transition focus:border-teal-400"
                />
                <input
                  type="text"
                  defaultValue="010"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold outline-none transition focus:border-teal-400"
                />
                <input
                  type="text"
                  defaultValue="+2.25"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold outline-none transition focus:border-teal-400"
                />
                <input
                  type="text"
                  defaultValue="None"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-center text-slate-400 outline-none transition focus:border-teal-400"
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                  Khoảng cách đồng tử (PD)
                </h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      PD đơn nhãn (R/L)
                    </span>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue="31.5"
                        className="w-full rounded-xl border border-slate-200 p-2 text-center font-semibold outline-none transition focus:border-teal-400"
                      />
                      <span className="text-slate-400">/</span>
                      <input
                        type="text"
                        defaultValue="32.0"
                        className="w-full rounded-xl border border-slate-200 p-2 text-center font-semibold outline-none transition focus:border-teal-400"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      PD hai mắt
                    </span>

                    <input
                      type="text"
                      defaultValue="63.5"
                      className="w-full rounded-xl border border-teal-400 bg-white p-2 text-center text-lg font-bold text-teal-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <MessageSquare size={16} className="text-slate-500" />
                  <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                    Ghi chú lâm sàng
                  </h4>
                </div>

                <textarea
                  placeholder="Nhập ghi chú cho nhóm vận hành..."
                  className="h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-teal-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;