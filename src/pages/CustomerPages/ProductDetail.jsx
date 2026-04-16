import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";

function normalizeText(text = "") {
  return text.toLowerCase().trim();
}

function isFashionOrSunglasses(product) {
  const category = normalizeText(product?.category);

  return (
    category.includes("kính râm") ||
    category.includes("kính mát") ||
    category.includes("kính thời trang")
  );
}

function isPrescriptionProduct(product) {
  const category = normalizeText(product?.category);

  return (
    category.includes("kính cận") ||
    category.includes("gọng kính") ||
    category.includes("gọng")
  );
}

function getProductActionType(product) {
  const stock = Number(product?.stock || 0);

  if (isFashionOrSunglasses(product)) {
    return stock > 0 ? "fashion-in-stock" : "fashion-preorder";
  }

  if (isPrescriptionProduct(product)) {
    return "prescription";
  }

  return stock > 0 ? "fashion-in-stock" : "fashion-preorder";
}

function getAvailability(product) {
  const actionType = getProductActionType(product);
  const stock = Number(product?.stock || 0);

  if (actionType === "fashion-preorder") {
    return {
      type: "preorder-only",
      label: "Hết hàng - đặt trước",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      helperText: "Sản phẩm hiện đang hết hàng, bạn vẫn có thể đặt trước.",
    };
  }

  if (actionType === "prescription") {
    return {
      type: "prescription",
      label: stock > 0 ? "Hỗ trợ làm kính theo toa" : "Nhận làm theo toa",
      className: "bg-sky-50 text-sky-700 border-sky-200",
    };
  }

  return {
    type: "in-stock",
    label: "Còn hàng",
    className: "bg-green-50 text-green-700 border-green-200",
    helperText: "",
  };
}

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = useMemo(
    () => products.find((item) => item.id === Number(id)),
    [id]
  );

  const [selectedSize, setSelectedSize] = useState(product?.size || "M");
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("in-stock");
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

  const availability = getAvailability(product);
  const actionType = getProductActionType(product);

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
    if (Number(product.stock || 0) <= 0) {
      toast.error("Sản phẩm hiện không còn sẵn hàng.");
      return;
    }

    setOrderType("in-stock");
    addToCart(product, quantity, selectedSize, "in-stock", null);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleAddPreOrder = () => {
    setOrderType("pre-order");
    addToCart(product, quantity, selectedSize, "pre-order", null);
    toast.success("Đã thêm đơn đặt trước vào giỏ hàng!");
  };

  const handleAddFrameOnly = () => {
    if (Number(product.stock || 0) <= 0) {
      toast.error("Sản phẩm hiện đang hết hàng.");
      return;
    }

    setOrderType("in-stock");
    addToCart(product, quantity, selectedSize, "in-stock", null);
    toast.success("Đã thêm gọng kính vào giỏ hàng!");
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

            <span
              className={`rounded-full border px-3 py-1 text-sm font-medium ${availability.className}`}
            >
              {availability.label}
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

          {availability.helperText && (
            <p className="mt-4 text-sm font-medium text-amber-700">
              {availability.helperText}
            </p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <p className="text-sm text-slate-500">Kiểu gọng</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                Full-rim
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Hình dạng</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                {product.frameType}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Chất liệu</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                Acetate
              </p>
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
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                Unisex
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            {actionType === "fashion-in-stock" && (
              <button
                type="button"
                onClick={handleAddNormalOrder}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-lg font-semibold text-white transition hover:opacity-90"
              >
                <span>🛒</span>
                <span>Mua ngay</span>
              </button>
            )}

            {actionType === "fashion-preorder" && (
              <button
                type="button"
                onClick={handleAddPreOrder}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-6 text-lg font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                <span>⏳</span>
                <span>Đặt trước</span>
              </button>
            )}

            {actionType === "prescription" && (
              <>
                <button
                  type="button"
                  onClick={handleOpenPrescriptionModal}
                  className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-lg font-semibold text-white transition hover:opacity-90"
                >
                  <span>👁️</span>
                  <span>Mua kính theo toa</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddFrameOnly}
                  className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 text-lg font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  <span>🛒</span>
                  <span>Mua gọng không tròng</span>
                </button>
              </>
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
          {relatedProducts.map((item) => {
            const relatedAvailability = getAvailability(item);

            return (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-56 overflow-hidden bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />

                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${relatedAvailability.className}`}
                    >
                      {relatedAvailability.label}
                    </span>
                  </div>
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
            );
          })}
        </div>
      </div>

     {isPrescriptionModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 md:px-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Đặt kính theo toa
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Điền thông tin toa và xác nhận đặt hàng
          </p>
        </div>

        <button
          type="button"
          onClick={handleClosePrescriptionModal}
          className="flex h-11 w-11 items-center justify-center rounded-full text-3xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          ×
        </button>
      </div>

      <div className="overflow-y-auto px-6 py-6 md:px-8 md:py-8">
        <div className="mb-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
          ℹ️ Thông tin này sẽ được nhân viên kiểm tra trước khi xử lý đơn hàng.
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
            <h3 className="mb-5 text-lg font-bold text-slate-900">
              Thông số mắt
            </h3>

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
                  className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-500"
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
                  className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-500"
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
                  className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-500"
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
                  className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-500"
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
                  className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-500"
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
                  className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-500"
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
                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <h3 className="mb-5 text-lg font-bold text-slate-900">
              Thông tin bổ sung
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Loại tròng
              </label>
              <select
                value={prescription.lensType}
                onChange={(e) =>
                  handlePrescriptionChange("lensType", e.target.value)
                }
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-teal-500"
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
                rows={5}
                placeholder="Ghi chú thêm..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Upload ảnh toa
              </label>

              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 bg-white px-4 py-8 text-center transition hover:bg-slate-50">
                <span className="text-4xl">📤</span>
                <span className="mt-3 text-slate-500">
                  Kéo thả hoặc click để upload
                </span>

                {prescription.imageName && (
                  <span className="mt-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-600">
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

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Sản phẩm:</span>{" "}
                {product.name}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-slate-900">Giá:</span>{" "}
                {product.price.toLocaleString("vi-VN")} đ
              </p>
              <p className="mt-2">
                <span className="font-semibold text-slate-900">Size:</span>{" "}
                {selectedSize}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleClosePrescriptionModal}
                className="h-12 flex-1 rounded-2xl border border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Huỷ
              </button>

              <button
                type="button"
                onClick={handleConfirmPrescriptionOrder}
                className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-base font-semibold text-white transition hover:opacity-90"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </section>
  );
}

export default ProductDetail;