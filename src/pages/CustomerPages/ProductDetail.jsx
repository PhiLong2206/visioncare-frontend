import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { getProductById, getProducts } from "../../api/productAPI";
const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f1f5f9'/%3E%3Crect x='260' y='245' width='280' height='110' rx='28' fill='%23e2e8f0'/%3E%3Ccircle cx='335' cy='300' r='42' fill='%23cbd5e1'/%3E%3Ccircle cx='465' cy='300' r='42' fill='%23cbd5e1'/%3E%3Cpath d='M377 300h46' stroke='%2394a3b8' stroke-width='18' stroke-linecap='round'/%3E%3C/svg%3E";

function getSafeProductImage(value) {
  const imageUrl = String(value || "").trim();
  if (!imageUrl) return FALLBACK_PRODUCT_IMAGE;

  if (
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  try {
    const parsed = new URL(imageUrl);
    const allowedHosts = ["localhost", "127.0.0.1", "images.unsplash.com"];
    const isAllowedHost = allowedHosts.some((host) =>
      parsed.hostname.toLowerCase().includes(host)
    );

    return isAllowedHost ? imageUrl : FALLBACK_PRODUCT_IMAGE;
  } catch {
    return FALLBACK_PRODUCT_IMAGE;
  }
}

function normalizeText(text = "") {
  return String(text).toLowerCase().trim();
}

function getCategoryName(item) {
  return (
    item?.category?.categoryName ||
    item?.category?.CategoryName ||
    item?.categoryName ||
    item?.CategoryName ||
    ""
  );
}

function inferProductKind(item) {
  const category = normalizeText(getCategoryName(item));
  const explicitIsFrame = item?.isFrame ?? item?.IsFrame;
  const explicitIsLens = item?.isLens ?? item?.IsLens;
  const isLens =
    explicitIsLens !== undefined
      ? Boolean(explicitIsLens)
      : category.includes("tròng");
  const isFrame =
    explicitIsFrame !== undefined
      ? Boolean(explicitIsFrame)
      : category.includes("gọng") ||
        category.includes("kính cận");

  return { isFrame, isLens };
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
  const rawVariants = Array.isArray(item?.productVariants)
    ? item.productVariants
    : Array.isArray(item?.ProductVariants)
    ? item.ProductVariants
    : [];
  const variants = rawVariants.map((variant) => ({
    ...variant,
    variantId: variant?.variantId ?? variant?.VariantId,
    color: variant?.color ?? variant?.Color ?? "",
    size: variant?.size ?? variant?.Size ?? "",
    sku: variant?.sku ?? variant?.Sku ?? "",
    stockQuantity: Number(variant?.stockQuantity ?? variant?.StockQuantity ?? 0),
    additionalPrice: Number(variant?.additionalPrice ?? variant?.AdditionalPrice ?? 0),
    effectivePrice: Number(
      variant?.effectivePrice ??
        variant?.EffectivePrice ??
        Number(item?.basePrice ?? item?.BasePrice ?? 0) +
          Number(variant?.additionalPrice ?? variant?.AdditionalPrice ?? 0)
    ),
  }));

  const firstVariant = variants[0] || {};
  const categoryName = getCategoryName(item);
  const { isFrame, isLens } = inferProductKind(item);
  
  // Calculate stock if totalStock is missing (happens on detail DTO)
  const totalStock = item?.totalStock ?? item?.TotalStock ?? variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
  
  // Calculate display price
  const displayPrice = item?.minPrice ?? item?.MinPrice ?? item?.basePrice ?? item?.BasePrice ?? (variants.length > 0 ? Math.min(...variants.map(v => v.effectivePrice)) : 0);

  return {
    id: item?.productId ?? item?.ProductId,
    name: item?.productName || "Sản phẩm",
    category: categoryName || "Chưa phân loại",
    description: item?.description || "Chưa có mô tả cho sản phẩm này.",
    price: Number(displayPrice),
    oldPrice: null,
    stock: Number(totalStock),
    image: getSafeProductImage(item?.image2D ?? item?.Image2D),
    rating: 4.8,
    reviews: 12,
    color: firstVariant?.color || "Nhiều màu",
    size: firstVariant?.size || "M",
    frameType: categoryName || "Classic",
    brand: item?.brand || "VisionCare",
    isPreOrder: Boolean(item?.isPreOrder ?? item?.IsPreOrder),
    isFrame,
    isLens,
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
  return product?.isFrame && !product?.isLens;
}

function isPrescriptionOnlyProduct(product) {
  const category = normalizeText(product?.category);

  return (
    product?.isLens ||
    category.includes("kính cận") ||
    category.includes("loạn") ||
    category.includes("đa tròng") ||
    category.includes("hai tròng")
  );
}

function getProductActionType(product, stock) {
  const currentStock = Number(stock ?? product?.stock ?? 0);
  const isFrame = isFrameOnlyProduct(product);
  const isFashion = isFashionOrSunglasses(product);
  const isPrescriptionOnly = isPrescriptionOnlyProduct(product);

  // Gọng kính: có hàng thì mua ngay + mua theo toa
  // hết hàng thì cho đặt trước nếu backend bật pre-order
  if (isFrame) {
    if (currentStock > 0) return "frame-flex";
    return "frame-pre-order";
  }

  // Kính mát / kính thời trang: có hàng mua ngay, hết hàng thì pre-order
  if (isFashion) {
    if (currentStock > 0) return "buy-now";
    return "pre-order";
  }

  // Tròng / sản phẩm bắt buộc theo toa
  if (isPrescriptionOnly) {
    return "prescription-only";
  }

  if (currentStock > 0) return "buy-now";
  return "pre-order";
}

function getAvailability(product, stock) {
  const actionType = getProductActionType(product, stock);

  if (actionType === "frame-pre-order") {
  return {
    type: "frame-pre-order",
    label: "Gọng hết hàng - đặt trước",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    helperText: "Gọng kính này hiện hết hàng, bạn có thể đặt trước hoặc chọn mẫu khác.",
  };
}

  if (actionType === "pre-order") {
    return {
      type: "pre-order",
      label: "Hết hàng - đặt trước",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      helperText: "Sản phẩm hiện hết hàng, bạn có thể đặt trước để giữ chỗ.",
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
  const { addCartItem, addCartCombo } = useCart();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [lensProducts, setLensProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedLensVariantId, setSelectedLensVariantId] = useState("");
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
    const fetchProductData = async () => {
      try {
        setLoading(true);

        // 1. Fetch main product detail
        const productData = await getProductById(id);
        const mappedProduct = mapProductFromApi(productData);
        setProduct(mappedProduct);

        if (mappedProduct?.variants?.length > 0) {
          const firstVer = mappedProduct.variants[0];
          setSelectedColor(firstVer.color || "");
          setSelectedSize(firstVer.size || "M");
        }

        // 2. Fetch all products to filter lenses and related
        try {
          const listJson = await getProducts();
          const rawList = Array.isArray(listJson?.data) ? listJson.data : [];
          const mappedList = rawList.map(mapProductFromApi);
          
          setProducts(mappedList);
          
          // Filter lens products (Category: Tròng kính)
          const lensSummaries = mappedList.filter(p => 
            normalizeText(p.category).includes("tròng") || p.isLens
          );
          const lenses = await Promise.all(
            lensSummaries.map(async (lens) => {
              if (lens.variants.length > 0) return lens;

              try {
                return mapProductFromApi(await getProductById(lens.id));
              } catch {
                return lens;
              }
            })
          );
          setLensProducts(lenses);
        } catch {
          setProducts([]);
          setLensProducts([]);
        }

      } catch (error) {
        console.error("Fetch product detail failed:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;

    const exactMatch = product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    if (exactMatch) return exactMatch;

    return product.variants.find((v) => v.color === selectedColor) || product.variants[0];
  }, [product, selectedColor, selectedSize]);

  const selectedVariantId = selectedVariant?.variantId || null;

  const availableColors = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.color))].filter(Boolean);
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.size))].filter(Boolean);
  }, [product]);

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
  
  const selectedLensVariant = useMemo(() => {
    if (!selectedLensVariantId) return null;
    for (const lp of lensProducts) {
      const v = lp.variants.find(v => Number(v.variantId) === Number(selectedLensVariantId));
      if (v) return { ...v, productName: lp.name, brand: lp.brand };
    }
    return null;
  }, [lensProducts, selectedLensVariantId]);

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
    // Basic eye metrics (PD is required, SPH is required)
    const requiredFields = ["leftSPH", "rightSPH", "pd"];

    const hasEmptyRequired = requiredFields.some(
      (field) => !String(prescription[field]).trim()
    );

    if (hasEmptyRequired) {
      toast.error("Vui lòng nhập đầy đủ SPH và PD.");
      return false;
    }

    // Lens selection is mandatory for combos
    if (!selectedLensVariantId) {
      toast.error("Vui lòng chọn một loại tròng kính.");
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
    productId,
    quantity,
    prescriptionId = null,
    successMessage = "Thêm vào giỏ hàng thành công!",
  }) => {
    try {
      if (
        (!variantId || Number(variantId) <= 0) &&
        (!productId || Number(productId) <= 0)
      ) {
        toast.error("Khong tim thay bien the san pham hop le.");
        return;
      }

      setIsSubmitting(true);
      await addCartItem({ variantId, productId, quantity, prescriptionId });
      toast.success(successMessage);
      navigate("/cart");
    } catch (error) {
      console.error("ADD CART ITEM ERROR:", error);
      toast.error(error.message || "Không thêm được sản phẩm vào giỏ hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCartComboApi = async ({
    frameVariantId,
    lensVariantId = 0,
    prescriptionData,
    successMessage = "Combo đã được thêm vào giỏ hàng!",
  }) => {
    try {
      setIsSubmitting(true);

      const prescription = {
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
      };

      await addCartCombo({ 
        frameVariantId, 
        lensVariantId, 
        prescription 
      });

      toast.success(successMessage);
      setIsPrescriptionModalOpen(false);
      resetPrescriptionForm();
      navigate("/cart");
    } catch (error) {
      console.error("ADD CART COMBO ERROR:", error);
      toast.error(error.message || "Không thêm được combo vào giỏ hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNormalOrder = async () => {
    if (!productForCart) return;
    const token = ensureAuthenticated();
    if (!token) return;

    if (displayStock <= 0) {
      toast.error("Biến thể này hiện không còn sẵn hàng.");
      return;
    }

    await addCartItemApi({
      variantId: productForCart.variantId,
      productId: productForCart.id,
      quantity,
      prescriptionId: null,
      successMessage: "Đã thêm vào giỏ hàng!",
    });
  };

  const handleAddPreOrder = async () => {
    if (!productForCart) return;
    const token = ensureAuthenticated();
    if (!token) return;

    await addCartItemApi({
      variantId: productForCart.variantId,
      productId: productForCart.id,
      quantity,
      prescriptionId: null,
      successMessage: "Đã thêm đơn đặt trước vào giỏ hàng!",
    });
  };

  const handleAddFrameOnly = async () => {
    if (!productForCart) return;
    const token = ensureAuthenticated();
    if (!token) return;

    if (displayStock <= 0) {
      toast.error("Biến thể này hiện đang hết hàng.");
      return;
    }

    await addCartItemApi({
      variantId: productForCart.variantId,
      productId: productForCart.id,
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

  const handleConfirmPrescriptionOrder = () => {
    const token = ensureAuthenticated();
    if (!token) return;

    if (!selectedVariantId) {
      toast.error("Vui lòng chọn màu sắc và kích thước gọng kính trước khi đặt theo toa.");
      return;
    }

    if (!validatePrescription()) return;

    addCartComboApi({
      frameVariantId: selectedVariantId,
      lensVariantId: selectedLensVariantId,
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

const showPrescriptionFlow =
  actionType === "prescription-only" || actionType === "frame-flex";

const showNormalBuy = actionType === "buy-now";

const showPreOrder =
  actionType === "pre-order" || actionType === "frame-pre-order";

const showFrameOnlyButton = actionType === "frame-flex";

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
              onError={(event) => {
                event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
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
            <div className="mt-8 space-y-5">
              {/* Color Selector */}
              {availableColors.length > 0 && (
                <div>
                  <p className="mb-2.5 text-sm font-semibold text-slate-700">
                    Màu sắc: <span className="text-slate-900">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                      const isActive = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setSelectedColor(color);
                            setQuantity(1);
                          }}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                            isActive
                              ? "border-slate-900 bg-slate-900 text-white shadow-md"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div>
                  <p className="mb-2.5 text-sm font-semibold text-slate-700">
                    Size: <span className="text-slate-900">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const isActive = selectedSize === size;
                      const hasVariant = product.variants.some(
                        (v) => v.size === size && v.color === selectedColor
                      );
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(size);
                            setQuantity(1);
                          }}
                          className={`h-10 min-w-[44px] rounded-full border px-4 text-sm font-semibold transition-all ${
                            isActive
                              ? "border-teal-600 bg-teal-600 text-white shadow-md"
                              : hasVariant
                              ? "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                              : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                          }`}
                          disabled={!hasVariant}
                          title={!hasVariant ? "Màu này không có size " + size : ""}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="mb-2.5 text-sm font-semibold text-slate-700">
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
                <span>👓</span>
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
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                    }}
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
              {/* Alert Bar */}
              <div className="mb-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                <span className="text-lg">ℹ️</span>
                <span>Thông tin này sẽ được nhân viên kiểm tra trước khi xử lý đơn hàng.</span>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left Column: Metrics */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900">Thông số mắt</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">Mắt trái - SPH</label>
                      <input
                        type="number" step="0.25"
                        value={prescription.leftSPH}
                        onChange={(e) => handlePrescriptionChange("leftSPH", e.target.value)}
                        placeholder="-2.00"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">Mắt phải - SPH</label>
                      <input
                        type="number" step="0.25"
                        value={prescription.rightSPH}
                        onChange={(e) => handlePrescriptionChange("rightSPH", e.target.value)}
                        placeholder="-1.75"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">Mắt trái - CYL</label>
                      <input
                        type="number" step="0.25"
                        value={prescription.leftCYL}
                        onChange={(e) => handlePrescriptionChange("leftCYL", e.target.value)}
                        placeholder="Để trống nếu không loạn"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">Mắt phải - CYL</label>
                      <input
                        type="number" step="0.25"
                        value={prescription.rightCYL}
                        onChange={(e) => handlePrescriptionChange("rightCYL", e.target.value)}
                        placeholder="Để trống nếu không loạn"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">Mắt trái - AXIS</label>
                      <input
                        type="number"
                        value={prescription.leftAXIS}
                        onChange={(e) => handlePrescriptionChange("leftAXIS", e.target.value)}
                        placeholder="Chỉ nhập khi có loạn"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">Mắt phải - AXIS</label>
                      <input
                        type="number"
                        value={prescription.rightAXIS}
                        onChange={(e) => handlePrescriptionChange("rightAXIS", e.target.value)}
                        placeholder="Chỉ nhập khi có loạn"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600">PD (khoảng cách đồng tử)</label>
                    <input
                      type="number" step="0.5"
                      value={prescription.pd}
                      onChange={(e) => handlePrescriptionChange("pd", e.target.value)}
                      placeholder="62"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Right Column: Additional Info */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900">Thông tin bổ sung</h3>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600">Chọn tròng kính</label>
                    <select
                      value={selectedLensVariantId}
                      onChange={(e) => setSelectedLensVariantId(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 bg-white outline-none focus:border-blue-500 transition"
                    >
                      <option value="">Chọn tròng kính</option>
                      {lensProducts.length === 0 && <option disabled>Không có tròng kính sẵn có</option>}
                      {lensProducts.map(lens => (
                        <optgroup key={lens.id} label={`${lens.brand} - ${lens.name}`}>
                          {lens.variants.map(v => (
                            <option key={v.variantId} value={v.variantId}>
                              {v.color} ({v.size}) - {Number(v.effectivePrice).toLocaleString()} đ
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600">Ghi chú</label>
                    <textarea
                      value={prescription.note}
                      onChange={(e) => handlePrescriptionChange("note", e.target.value)}
                      rows={3}
                      placeholder="Ghi chú thêm..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600">Upload ảnh toa</label>
                    <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-white transition hover:bg-slate-50">
                      <span className="text-2xl">📸</span>
                      <span className="mt-2 text-xs text-slate-500">
                        {prescription.imageName || "Kéo thả hoặc click để upload"}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePrescriptionFileChange} />
                    </label>
                  </div>

                  {/* Summary Card */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sản phẩm:</span>
                        <span className="font-semibold text-slate-900">{product.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Giá:</span>
                        <span className="font-semibold text-slate-900">{displayPrice.toLocaleString()} đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Size:</span>
                        <span className="font-semibold text-slate-900">{displaySize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Màu:</span>
                        <span className="font-semibold text-slate-900">{displayColor}</span>
                      </div>
                    </div>
                    
                    {selectedLensVariant && (
                      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-base font-bold text-slate-900">TỔNG CỘNG:</span>
                        <span className="text-lg font-black text-blue-600">
                          {(displayPrice + Number(selectedLensVariant.effectivePrice)).toLocaleString()} đ
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleClosePrescriptionModal}
                      className="h-12 flex-1 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      Huỷ
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmPrescriptionOrder}
                      disabled={isSubmitting}
                      className="h-12 flex-[1.5] rounded-xl bg-blue-500 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-600 disabled:opacity-50"
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

