import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const PRODUCT_API = "/api/Product";
const CART_ITEM_API = "/api/Cart/items";
const CART_COMBO_API = "/api/Cart/combo";

function normalizeText(text = "") {
  return String(text).toLowerCase().trim();
}

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function mapProductFromApi(item) {
  const variants = Array.isArray(item?.productVariants)
    ? item.productVariants
    : [];

  const firstVariant = variants[0] || {};

  return {
    id: item?.productId,
    name: item?.productName || "Sản phẩm",
    category: item?.category?.categoryName || "Chưa phân loại",
    description: item?.description || "Chưa có mô tả cho sản phẩm này.",
    price: Number(item?.minPrice ?? item?.basePrice ?? 0),
    oldPrice: null,
    stock: Number(item?.totalStock ?? 0),
    image:
      item?.image2D ||
      "https://images.unsplash.com/photo-1511499767350-a15941da636c?q=80&w=500&auto=format&fit=crop",
    rating: 4.8,
    reviews: 12,
    color: firstVariant?.color || "Nhiều màu",
    size: firstVariant?.size || "M",
    frameType: item?.category?.categoryName || "Classic",
    brand: item?.brand || "VisionCare",
    isPreOrder: Boolean(item?.isPreOrder),
    isFrame: Boolean(item?.isFrame),
    isLens: Boolean(item?.isLens),
    variants,
  };
}

function isFashionOrSunglasses(product) {
  const category = normalizeText(product?.category);

  return (
    category.includes("kính râm") ||
    category.includes("kính mát") ||
    category.includes("kính thời trang")
  );
}

function isFrameOnlyProduct(product) {
  return Boolean(product?.isFrame) && !Boolean(product?.isLens);
}

function isPrescriptionOnlyProduct(product) {
  const category = normalizeText(product?.category);

  return (
    Boolean(product?.isLens) ||
    category.includes("kính cận") ||
    category.includes("loạn") ||
    category.includes("đa tròng") ||
    category.includes("hai tròng")
  );
}

function getProductActionType(product, stock) {
  const currentStock = Number(stock ?? product?.stock ?? 0);

  // Kính mát / kính thời trang / gọng kính:
  // còn hàng thì mua ngay, hết hàng thì cho pre-order
  if (isFashionOrSunglasses(product) || isFrameOnlyProduct(product)) {
    if (currentStock > 0) return "buy-now";
    return "pre-order";
  }

  // Kính cận / loạn / đa tròng:
  // vẫn đi theo luồng toa kính
  if (isPrescriptionOnlyProduct(product)) {
    return "prescription-only";
  }

  if (currentStock > 0) return "buy-now";
  if (product?.isPreOrder) return "pre-order";
  return "out-of-stock";
}

function getAvailability(product, stock) {
  const actionType = getProductActionType(product, stock);

  if (actionType === "pre-order") {
    return {
      type: "pre-order",
      label: "Hết hàng - đặt trước",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      helperText: "Sản phẩm hiện đang hết hàng, bạn vẫn có thể đặt trước.",
    };
  }

  if (actionType === "prescription-only") {
    return {
      type: "prescription-only",
      label: "Chỉ bán theo toa",
      className: "bg-sky-50 text-sky-700 border-sky-200",
      helperText:
        "Sản phẩm này cần nhập thông tin toa kính hoặc chọn mua gọng không tròng.",
    };
  }

  if (actionType === "out-of-stock") {
    return {
      type: "out-of-stock",
      label: "Hết hàng",
      className: "bg-slate-100 text-slate-600 border-slate-200",
      helperText: "Sản phẩm hiện đang tạm hết hàng.",
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
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(PRODUCT_API);
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const json = await res.json();
        const rawProducts = Array.isArray(json?.data) ? json.data : [];
        const mappedProducts = rawProducts.map(mapProductFromApi);

        setProducts(mappedProducts);

        const foundProduct = mappedProducts.find(
          (item) => Number(item.id) === Number(id)
        );

        setProduct(foundProduct || null);

        if (foundProduct?.variants?.length > 0) {
          setSelectedVariantId(foundProduct.variants[0].variantId);
          setSelectedSize(foundProduct.variants[0].size || foundProduct.size);
        }
      } catch (error) {
        console.error("Fetch product detail failed:", error);
        setProduct(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;

    return (
      product.variants.find(
        (variant) => Number(variant.variantId) === Number(selectedVariantId)
      ) || product.variants[0]
    );
  }, [product, selectedVariantId]);

  const displayPrice = Number(
    selectedVariant?.effectivePrice ?? product?.price ?? 0
  );

  const displayColor = selectedVariant?.color || product?.color || "Nhiều màu";
  const displaySize = selectedVariant?.size || selectedSize || product?.size;
  const displayStock = Number(
    selectedVariant?.stockQuantity ?? product?.stock ?? 0
  );

  const productForCart = useMemo(() => {
    if (!product) return null;

    return {
      ...product,
      price: displayPrice,
      stock: displayStock,
      color: displayColor,
      size: displaySize,
      variantId: selectedVariant?.variantId || null,
      sku: selectedVariant?.sku || null,
    };
  }, [
    product,
    displayPrice,
    displayStock,
    displayColor,
    displaySize,
    selectedVariant,
  ]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.id !== product.id).slice(0, 3);
  }, [products, product]);

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

  const ensureAuthenticated = () => {
    const token = getAccessToken();

    if (!token) {
      toast.error("Bạn cần đăng nhập trước.");
      navigate("/login");
      return null;
    }

    return token;
  };

  const addCartItemApi = async ({
    variantId,
    quantity,
    prescriptionId = null,
    successMessage,
  }) => {
    const token = ensureAuthenticated();
    if (!token) return;

    try {
      setIsSubmitting(true);

      const payload = {
        variantId,
        quantity,
        ...(prescriptionId ? { prescriptionId } : {}),
      };

      console.log("ADD CART ITEM PAYLOAD:", payload);

      const res = await fetch(CART_ITEM_API, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      console.log("ADD CART ITEM RESPONSE:", responseData);

      if (res.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn.");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const errorMessage =
          responseData?.message ||
          responseData?.title ||
          `Thêm vào giỏ hàng thất bại (${res.status})`;
        throw new Error(errorMessage);
      }

      toast.success(successMessage);
      navigate("/cart");
    } catch (error) {
      console.error("Add cart item failed:", error);
      toast.error(error.message || "Không thể thêm vào giỏ hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCartComboApi = async ({
    frameVariantId,
    lensVariantId = 0,
    prescriptionData,
    successMessage,
  }) => {
    const token = ensureAuthenticated();
    if (!token) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(CART_COMBO_API, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          frameVariantId,
          lensVariantId,
          prescription: {
            odSphere: Number(prescriptionData.rightSPH || 0),
            odCylinder: Number(prescriptionData.rightCYL || 0),
            odAxis: Number(prescriptionData.rightAXIS || 0),
            osSphere: Number(prescriptionData.leftSPH || 0),
            osCylinder: Number(prescriptionData.leftCYL || 0),
            osAxis: Number(prescriptionData.leftAXIS || 0),
            pd: Number(prescriptionData.pd || 0),
            note:
              [
                prescriptionData.lensType
                  ? `Loại tròng: ${prescriptionData.lensType}`
                  : "",
                prescriptionData.note || "",
                prescriptionData.imageName
                  ? `Ảnh toa: ${prescriptionData.imageName}`
                  : "",
              ]
                .filter(Boolean)
                .join(" | ") || "Không có ghi chú",
          },
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      console.log("ADD CART COMBO RESPONSE:", responseData);

      if (res.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn.");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const errorMessage =
          responseData?.message ||
          responseData?.title ||
          `Thêm combo vào giỏ hàng thất bại (${res.status})`;
        throw new Error(errorMessage);
      }

      toast.success(successMessage);
      setIsPrescriptionModalOpen(false);
      resetPrescriptionForm();
      navigate("/cart");
    } catch (error) {
      console.error("Add cart combo failed:", error);
      toast.error(error.message || "Không thể thêm combo vào giỏ hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNormalOrder = async () => {
    if (!productForCart) return;

    if (displayStock <= 0) {
      toast.error("Biến thể này hiện không còn sẵn hàng.");
      return;
    }

    await addCartItemApi({
      variantId: productForCart.variantId,
      quantity,
      prescriptionId: null,
      successMessage: "Đã thêm vào giỏ hàng!",
    });
  };

  const handleAddPreOrder = async () => {
    if (!productForCart) return;

    await addCartItemApi({
      variantId: productForCart.variantId,
      quantity,
      prescriptionId: null,
      successMessage: "Đã thêm đơn đặt trước vào giỏ hàng!",
    });
  };

  const handleAddFrameOnly = async () => {
    if (!productForCart) return;

    if (displayStock <= 0) {
      toast.error("Biến thể này hiện đang hết hàng.");
      return;
    }

    await addCartItemApi({
      variantId: productForCart.variantId,
      quantity,
      prescriptionId: null,
      successMessage: "Đã thêm gọng kính vào giỏ hàng!",
    });
  };

  const handleOpenPrescriptionModal = () => {
    setIsPrescriptionModalOpen(true);
  };

  const handleClosePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
  };

  const handleConfirmPrescriptionOrder = async () => {
    if (!productForCart) return;
    if (!validatePrescription()) return;

    await addCartComboApi({
      frameVariantId: productForCart.variantId,
      lensVariantId: 0,
      prescriptionData: prescription,
      successMessage: "Đã thêm đơn kính theo toa vào giỏ hàng!",
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-lg font-semibold text-slate-900">
          Đang tải sản phẩm...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-lg font-semibold text-slate-900">
          Không tìm thấy sản phẩm.
        </p>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <span>←</span>
          <span>Quay lại trang sản phẩm</span>
        </Link>
      </div>
    );
  }

  const availability = getAvailability(product, displayStock);
  const actionType = getProductActionType(product, displayStock);
  const showPrescriptionFlow = actionType === "prescription-only";
  const showNormalBuy = actionType === "buy-now";
  const showPreOrder = actionType === "pre-order";
  const showFrameOnlyButton = showPrescriptionFlow && Boolean(product.isFrame);

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
            {product.category} · {product.brand}
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
              {displayPrice.toLocaleString("vi-VN")} đ
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

          {product.variants.length > 0 && (
            <div className="mt-8 space-y-6">
              <div>
                <p className="mb-3 text-sm font-medium text-slate-900">
                  Chọn biến thể
                </p>

                <div className="grid gap-3">
                  {product.variants.map((variant) => {
                    const active =
                      Number(selectedVariantId) === Number(variant.variantId);

                    return (
                      <button
                        key={variant.variantId}
                        type="button"
                        onClick={() => {
                          setSelectedVariantId(variant.variantId);
                          setSelectedSize(variant.size || "M");
                          setQuantity(1);
                        }}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white hover:border-slate-400"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold">
                              {variant.color} · Size {variant.size}
                            </p>
                            <p
                              className={`text-sm ${
                                active ? "text-slate-200" : "text-slate-500"
                              }`}
                            >
                              SKU: {variant.sku}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">
                              {Number(variant.effectivePrice).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              đ
                            </p>
                            <p
                              className={`text-sm ${
                                active ? "text-slate-200" : "text-slate-500"
                              }`}
                            >
                              Tồn: {variant.stockQuantity}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-900">
                  Số lượng
                </p>

                <div className="flex w-fit items-center rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={isSubmitting}
                    className="h-12 w-12 text-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    -
                  </button>

                  <span className="flex h-12 min-w-[56px] items-center justify-center text-base font-semibold text-slate-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(displayStock || prev + 1, prev + 1)
                      )
                    }
                    disabled={
                      isSubmitting ||
                      (displayStock > 0 && quantity >= displayStock)
                    }
                    className="h-12 w-12 text-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <p className="text-sm text-slate-500">Kiểu gọng</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                {product.isFrame ? "Frame" : "Standard"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Hình dạng</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                {product.frameType}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Màu sắc</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                {displayColor}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Size</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                {displaySize}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Tồn kho</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                {displayStock}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Thương hiệu</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">
                {product.brand}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            {showNormalBuy && (
              <button
                type="button"
                onClick={handleAddNormalOrder}
                disabled={isSubmitting}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <span>🛒</span>
                <span>{isSubmitting ? "Đang xử lý..." : "Mua ngay"}</span>
              </button>
            )}

            {showPreOrder && (
              <button
                type="button"
                onClick={handleAddPreOrder}
                disabled={isSubmitting}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-6 text-lg font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
              >
                <span>⏳</span>
                <span>{isSubmitting ? "Đang xử lý..." : "Đặt trước"}</span>
              </button>
            )}

            {showPrescriptionFlow && (
              <button
                type="button"
                onClick={handleOpenPrescriptionModal}
                disabled={isSubmitting}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <span>👁️</span>
                <span>Mua kính theo toa</span>
              </button>
            )}

            {showFrameOnlyButton && (
              <button
                type="button"
                onClick={handleAddFrameOnly}
                disabled={isSubmitting}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 text-lg font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <span>🛒</span>
                <span>
                  {isSubmitting ? "Đang xử lý..." : "Mua gọng không tròng"}
                </span>
              </button>
            )}

            {!showNormalBuy && !showPreOrder && !showPrescriptionFlow && (
              <button
                type="button"
                disabled
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-slate-100 px-6 text-lg font-semibold text-slate-500"
              >
                Tạm hết hàng
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
          {relatedProducts.map((item) => {
            const relatedAvailability = getAvailability(item, item.stock);

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
                    {item.category} · {item.brand}
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
                disabled={isSubmitting}
                className="flex h-11 w-11 items-center justify-center rounded-full text-3xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 md:px-8 md:py-8">
              <div className="mb-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                ℹ️ Thông tin này sẽ được nhân viên kiểm tra trước khi xử lý đơn
                hàng.
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
                        type="number"
                        step="0.25"
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
                        type="number"
                        step="0.25"
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
                        type="number"
                        step="0.25"
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
                        type="number"
                        step="0.25"
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
                        type="number"
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
                        type="number"
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
                      type="number"
                      step="0.5"
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
                      <span className="font-semibold text-slate-900">
                        Sản phẩm:
                      </span>{" "}
                      {product.name}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Giá:
                      </span>{" "}
                      {displayPrice.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Size:
                      </span>{" "}
                      {displaySize}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Màu:
                      </span>{" "}
                      {displayColor}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleClosePrescriptionModal}
                      disabled={isSubmitting}
                      className="h-12 flex-1 rounded-2xl border border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                    >
                      Huỷ
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmPrescriptionOrder}
                      disabled={isSubmitting}
                      className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
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