import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

const ORDER_TYPE_LABELS = {
  "in-stock": "Mua thường",
  "pre-order": "Đặt trước",
  prescription: "Mua kính theo toa",
};

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = useMemo(
    () => products.find((item) => item.id === Number(id)),
    [id]
  );

  const [selectedSize, setSelectedSize] = useState(product?.size || "M");
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState(
    product?.availableOrderTypes?.[0] || "in-stock"
  );
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] =
    useState(false);

  const [prescription, setPrescription] = useState({
    leftSPH: "",
    rightSPH: "",
    leftCYL: "",
    rightCYL: "",
    leftAXIS: "",
    rightAXIS: "",
    pd: "",
    lensType: "",
    note: "",
    imageName: "",
  });

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-lg font-semibold text-slate-900">
          Không tìm thấy sản phẩm.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <span>←</span>
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const handlePrescriptionChange = (field, value) => {
    setPrescription((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrescriptionFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPrescription((prev) => ({
      ...prev,
      imageName: file.name,
    }));

    toast.success("Đã tải ảnh toa lên!");
  };

  const resetPrescriptionForm = () => {
    setPrescription({
      leftSPH: "",
      rightSPH: "",
      leftCYL: "",
      rightCYL: "",
      leftAXIS: "",
      rightAXIS: "",
      pd: "",
      lensType: "",
      note: "",
      imageName: "",
    });
  };

  const validatePrescription = () => {
    const requiredFields = ["leftSPH", "rightSPH", "pd", "lensType"];

    const hasEmptyRequired = requiredFields.some(
      (field) => !String(prescription[field]).trim()
    );

    if (hasEmptyRequired) {
      toast.error("Vui lòng nhập SPH, PD và loại tròng.");
      return false;
    }

    const leftCYL = String(prescription.leftCYL || "").trim();
    const rightCYL = String(prescription.rightCYL || "").trim();
    const leftAXIS = String(prescription.leftAXIS || "").trim();
    const rightAXIS = String(prescription.rightAXIS || "").trim();

    if (leftCYL && !leftAXIS) {
      toast.error("Vui lòng nhập AXIS mắt trái khi đã nhập CYL.");
      return false;
    }

    if (rightCYL && !rightAXIS) {
      toast.error("Vui lòng nhập AXIS mắt phải khi đã nhập CYL.");
      return false;
    }

    return true;
  };

  const handleAddNormalOrder = () => {
    addToCart(product, quantity, selectedSize, "in-stock", null);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleAddPreOrder = () => {
    addToCart(product, quantity, selectedSize, "pre-order", null);
    toast.success("Đã thêm đơn đặt trước vào giỏ hàng!");
  };

  const handleOpenPrescriptionModal = () => {
    setOrderType("prescription");
    setIsPrescriptionModalOpen(true);
  };

  const handleClosePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
  };

  const handleConfirmPrescriptionOrder = () => {
    if (!validatePrescription()) return;

    addToCart(product, quantity, selectedSize, "prescription", prescription);
    toast.success("Đã thêm đơn kính theo toa vào giỏ hàng!");
    setIsPrescriptionModalOpen(false);
    resetPrescriptionForm();
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        <span>←</span>
        <span>Quay lại</span>
      </Link>

     <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
  <div className="flex min-h-[420px] items-center justify-center bg-slate-50 p-8 md:min-h-[520px] lg:min-h-[620px]">
    <img
      src={product.image}
      alt={product.name}
      className="max-h-[520px] w-auto max-w-full object-contain"
    />
  </div>
</div>

       <div className="max-w-[560px] pt-1">
  <p className="text-sm text-slate-500">
    {product.category} · {product.frameType}
  </p>

  <h1 className="mt-2 text-[34px] font-bold leading-tight text-slate-900 lg:text-[52px]">
    {product.name}
  </h1>

  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
    <span className="text-yellow-500">⭐ {product.rating}</span>
    <span>({product.reviews} đánh giá)</span>

    <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
      {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
    </span>
  </div>

  <div className="mt-5 flex flex-wrap items-center gap-4">
    <span className="text-[40px] font-bold text-teal-600 lg:text-[44px]">
      {product.price.toLocaleString("vi-VN")} đ
    </span>

    {product.oldPrice && (
      <span className="text-[20px] text-gray-400 line-through">
        {product.oldPrice.toLocaleString("vi-VN")} đ
      </span>
    )}
  </div>

  <p className="mt-8 text-[17px] leading-8 text-slate-600">
    {product.description}
  </p>

  <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
    <div>
      <p className="text-sm text-slate-500">Kiểu gọng</p>
      <p className="mt-1 text-[16px] font-semibold text-slate-900">Full-rim</p>
    </div>

    <div>
      <p className="text-sm text-slate-500">Hình dạng</p>
      <p className="mt-1 text-[16px] font-semibold text-slate-900">
        {product.frameType}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">Chất liệu</p>
      <p className="mt-1 text-[16px] font-semibold text-slate-900">Acetate</p>
    </div>

    <div>
      <p className="text-sm text-slate-500">Màu sắc</p>
      <p className="mt-1 text-[16px] font-semibold text-slate-900">
        {product.color}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">Size</p>
      <p className="mt-1 text-[16px] font-semibold text-slate-900">
        {selectedSize}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">Giới tính</p>
      <p className="mt-1 text-[16px] font-semibold text-slate-900">Unisex</p>
    </div>
  </div>

  <div className="mt-10 flex flex-col gap-3">
    {product.availableOrderTypes?.includes("in-stock") && (
      <button
        type="button"
        onClick={handleAddNormalOrder}
        className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-lg font-semibold text-white transition hover:opacity-90"
      >
        <span>🛒</span>
        <span>Thêm vào giỏ hàng</span>
      </button>
    )}

    {product.availableOrderTypes?.includes("pre-order") && (
      <button
        type="button"
        onClick={handleAddPreOrder}
        className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-6 text-lg font-semibold text-amber-700 transition hover:bg-amber-100"
      >
        <span>⏳</span>
        <span>Đặt trước</span>
      </button>
    )}

    {product.availableOrderTypes?.includes("prescription") && (
      <button
        type="button"
        onClick={handleOpenPrescriptionModal}
        className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 text-lg font-semibold text-slate-900 transition hover:bg-slate-50"
      >
        <span>👁️</span>
        <span>Mua kính theo toa</span>
      </button>
    )}
  </div>

  <div className="mt-8 space-y-4 text-[16px] text-slate-500">
    <div className="flex items-center gap-3">
      <span className="text-teal-500">🚚</span>
      <span>Miễn phí vận chuyển đơn từ 2 triệu</span>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-teal-500">🛡️</span>
      <span>Bảo hành 12 tháng chính hãng</span>
    </div>
  </div>
</div>
</div>
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">
          Sản phẩm liên quan
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedProducts.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-56 overflow-hidden bg-slate-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="text-sm text-slate-500">
                  {item.category} · {item.frameType}
                </p>

                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-lg font-bold text-teal-600">
                  {item.price.toLocaleString("vi-VN")} đ
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <h2 className="text-2xl font-bold text-slate-900">
                Đặt kính theo toa
              </h2>

              <button
                type="button"
                onClick={handleClosePrescriptionModal}
                className="text-3xl leading-none text-slate-400 transition hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="mb-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                ℹ️ Thông tin này sẽ được nhân viên kiểm tra trước khi xử lý đơn
                hàng.
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Mắt trái - SPH
                  </label>
                  <input
                    type="text"
                    value={prescription.leftSPH}
                    onChange={(e) =>
                      handlePrescriptionChange("leftSPH", e.target.value)
                    }
                    placeholder="-2.00"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Mắt phải - SPH
                  </label>
                  <input
                    type="text"
                    value={prescription.rightSPH}
                    onChange={(e) =>
                      handlePrescriptionChange("rightSPH", e.target.value)
                    }
                    placeholder="-1.75"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Mắt trái - CYL
                  </label>
                  <input
                    type="text"
                    value={prescription.leftCYL}
                    onChange={(e) =>
                      handlePrescriptionChange("leftCYL", e.target.value)
                    }
                    placeholder="Để trống nếu không loạn"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Mắt phải - CYL
                  </label>
                  <input
                    type="text"
                    value={prescription.rightCYL}
                    onChange={(e) =>
                      handlePrescriptionChange("rightCYL", e.target.value)
                    }
                    placeholder="Để trống nếu không loạn"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Mắt trái - AXIS
                  </label>
                  <input
                    type="text"
                    value={prescription.leftAXIS}
                    onChange={(e) =>
                      handlePrescriptionChange("leftAXIS", e.target.value)
                    }
                    placeholder="Chỉ nhập khi có loạn"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Mắt phải - AXIS
                  </label>
                  <input
                    type="text"
                    value={prescription.rightAXIS}
                    onChange={(e) =>
                      handlePrescriptionChange("rightAXIS", e.target.value)
                    }
                    placeholder="Chỉ nhập khi có loạn"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  PD (khoảng cách đồng tử)
                </label>
                <input
                  type="text"
                  value={prescription.pd}
                  onChange={(e) =>
                    handlePrescriptionChange("pd", e.target.value)
                  }
                  placeholder="62"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Loại tròng
                </label>
                <select
                  value={prescription.lensType}
                  onChange={(e) =>
                    handlePrescriptionChange("lensType", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500"
                >
                  <option value="">Chọn loại tròng</option>
                  <option value="Đơn tròng">Đơn tròng</option>
                  <option value="Hai tròng">Hai tròng</option>
                  <option value="Đa tròng">Đa tròng</option>
                  <option value="Chống ánh sáng xanh">
                    Chống ánh sáng xanh
                  </option>
                </select>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Ghi chú
                </label>
                <textarea
                  value={prescription.note}
                  onChange={(e) =>
                    handlePrescriptionChange("note", e.target.value)
                  }
                  rows={4}
                  placeholder="Ghi chú thêm..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Upload ảnh toa
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 px-4 py-10 text-center transition hover:bg-slate-50">
                  <span className="text-3xl">📤</span>
                  <span className="mt-3 text-slate-500">
                    Kéo thả hoặc click để upload
                  </span>

                  {prescription.imageName && (
                    <span className="mt-2 text-sm font-medium text-teal-600">
                      {prescription.imageName}
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePrescriptionFileChange}
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleConfirmPrescriptionOrder}
                className="mt-6 h-12 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-base font-semibold text-white transition hover:opacity-90"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;