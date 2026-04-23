import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const PaymentSimulation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationId, orderId, paymentLinkId, checkoutUrl, amount, orderType, paymentType } = location.state || {};
  
  const [isSimulating, setIsSimulating] = useState(false);

  const activeId = reservationId || orderId;

  if (!activeId || !checkoutUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lỗi truy cập</h1>
          <p className="text-slate-600 mb-6">Thông tin thanh toán không hợp lệ hoặc đã hết hạn.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold hover:bg-slate-800 transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const handleSimulateSuccess = async () => {
    try {
      setIsSimulating(true);
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      // Choose endpoint based on order type and payment type
      let endpoint = "";
      if (orderType === "Pre-order") {
        endpoint = paymentType === 'final'
          ? `/api/v1/customer/pre-orders/${reservationId}/simulate-final-payment`
          : `/api/v1/customer/pre-orders/${reservationId}/simulate-payment`;
      } else {
        endpoint = `/api/Orders/${orderId}/simulate-payment`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Giả lập thất bại");

      toast.success("Giả lập thanh toán thành công!");
      
      if (orderType === "Pre-order") {
        navigate(`/payment/success?reservationId=${reservationId}&paymentLinkId=${paymentLinkId || ''}&type=${paymentType || 'deposit'}`);
      } else {
        navigate(`/payment/success?orderId=${orderId}&paymentLinkId=${paymentLinkId || ''}`);
      }
    } catch (error) {
      toast.error("Không thể giả lập thanh toán. Vui lòng thử lại.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRealPayment = () => {
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Xác nhận thanh toán</h1>
          <p className="text-slate-600">Vui lòng chọn phương thức xác nhận giao dịch của bạn</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Real Payment Option */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-8">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Thanh toán thật (PayOS)</h2>
              <p className="text-slate-600 mb-8 min-h-[60px]">
                Bạn sẽ được chuyển hướng đến trang quét mã QR của hệ thống PayOS để thực hiện giao dịch ngân hàng thật.
              </p>
              <button 
                onClick={handleRealPayment}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white rounded-2xl py-4 font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-100"
              >
                Tiếp tục đến mã QR <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 italic text-sm text-slate-500">
               Khuyên dùng để kiểm tra tính ổn định của hệ thống
            </div>
          </div>

          {/* Simulation Option */}
          <div className="bg-white rounded-3xl shadow-sm border border-amber-200 overflow-hidden hover:shadow-md transition-shadow relative">
            <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Dành cho Demo
            </div>
            <div className="p-8">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Giả lập thanh toán</h2>
              <p className="text-slate-600 mb-8 min-h-[60px]">
                Xác nhận đã thanh toán ngay lập tức mà không cần chuyển khoản thật. Dùng để test nhanh các luồng sau thanh toán.
              </p>
              <button 
                onClick={handleSimulateSuccess}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white rounded-2xl py-4 font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-100 disabled:opacity-50"
              >
                {isSimulating ? "Đang xử lý..." : "Xác nhận đã chuyển khoản"} <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-amber-50 px-8 py-4 border-t border-amber-100 italic text-sm text-amber-700">
              Phù hợp cho mục đích thuyết trình, báo cáo project
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Số tiền cần thanh toán</p>
                    <p className="text-xl font-bold text-slate-900">{amount?.toLocaleString('vi-VN')} đ</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-slate-500">Loại thanh toán</p>
                <p className="font-semibold text-slate-900">
                  {paymentType === 'final'
                    ? 'Thanh toán còn lại (70%)'
                    : orderType === 'Pre-order'
                    ? 'Tiền đặt cọc (30%)'
                    : 'Thanh toán đơn hàng'}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSimulation;
