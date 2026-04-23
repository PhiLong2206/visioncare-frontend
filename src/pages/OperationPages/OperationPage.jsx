import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Truck,
  Upload,
  X,
  CheckCircle2,
  Package,
  ChevronLeft,
  Warehouse,
  ClipboardList,
  Plus,
  Bell,
  LogOut,
  Settings2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import OperationSidebar from "./OperationSidebar";
import ConfirmModal from "../../components/ConfirmModal";
import {
  getLowStock,
  getWarehouses,
} from "../../api/opsInventoryAPI";
import {
  getOpsOrders,
  getOpsOrderDetail,
  getPreOrderOrders,
  updateOrderStatus,
  packOrder,
} from "../../api/opsOrderAPI";
import {
  getReceipts,
  createPurchaseRequest,
  submitEvidence
} from "../../api/opsProcurementAPI";
import {
  createShippingOrder,
  getShippingMethods,
  markAsShipped,
} from "../../api/opsShippingAPI";
import { getProducts } from "../../api/productAPI";

const ORDER_TYPES = ["Tất cả", "ORDER", "PRESCRIPTION", "PRE-ORDER"];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function getStatusClass(status) {
  switch (status) {
    case "Hoàn thành":
      return "border border-green-200 bg-green-50 text-green-600";
    case "Đang giao hàng":
      return "border border-blue-200 bg-blue-50 text-blue-600";
    case "Đã giao hàng":
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Sẵn sàng giao hàng":
      return "border border-amber-200 bg-amber-50 text-amber-700";
    case "Đã xác nhận":
      return "border border-indigo-200 bg-indigo-50 text-indigo-600";
    case "Đang đóng gói":
      return "border border-blue-200 bg-blue-50 text-blue-600";
    case "Đang mài tròng":
      return "border border-teal-200 bg-teal-50 text-teal-600";
    case "Đang lắp kính":
      return "border border-cyan-200 bg-cyan-50 text-cyan-700";
    case "Đang xử lý":
      return "border border-cyan-200 bg-cyan-50 text-cyan-600";
    case "Chờ nhập hàng":
      return "border border-orange-200 bg-orange-50 text-orange-700";
    case "Chờ duyệt":
      return "border border-yellow-200 bg-yellow-50 text-yellow-700";
    case "Đã nhập hàng":
      return "border border-lime-200 bg-lime-50 text-lime-700";
    default:
      return "border border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getProcessingNextStatus(status, type) {
  if (type === "PRESCRIPTION") {
    switch (status) {
      case "Đã xác nhận":
        return "Đang đóng gói";
      case "Đang đóng gói":
        return "Sẵn sàng giao hàng";
      default:
        return status;
    }
  }

  if (type === "PRE-ORDER") {
    switch (status) {
      case "Đã nhập hàng":
        return "Đang đóng gói";
      case "Đang đóng gói":
        return "Sẵn sàng giao hàng";
      default:
        return status;
    }
  }

  switch (status) {
    case "Đã xác nhận":
      return "Đang đóng gói";
    case "Đang đóng gói":
      return "Sẵn sàng giao hàng";
    default:
      return status;
  }
}

function getDeliveryNextStatus(status) {
  switch (status) {
    case "Sẵn sàng giao hàng":
      return "Đang giao hàng";
    case "Đã giao hàng":
      return "Hoàn thành";
    default:
      return status;
  }
}

function getProcessList(order) {
  if (!order) return [];

  if (order.type === "PRESCRIPTION") {
    return [
      "Đã xác nhận",
      "Đang đóng gói",
      "Sẵn sàng giao hàng",
      "Đang giao hàng",
      "Đã giao hàng",
      "Hoàn thành",
    ];
  }

  if (order.type === "PRE-ORDER") {
    return [
      "Đã xác nhận",
      "Chờ nhập hàng",
      "Chờ duyệt",
      "Đã nhập hàng",
      "Đang đóng gói",
      "Sẵn sàng giao hàng",
      "Đang giao hàng",
      "Đã giao hàng",
      "Hoàn thành",
    ];
  }

  return [
    "Đã xác nhận",
    "Đang đóng gói",
    "Sẵn sàng giao hàng",
    "Đang giao hàng",
    "Đã giao hàng",
    "Hoàn thành",
  ];
}

function getOperationTask(order) {
  if (!order) return "";

  if (order.type === "PRESCRIPTION") {
    return "Operation Staff thực hiện mài tròng, lắp kính, kiểm tra chất lượng, đóng gói và chuyển sang trạng thái sẵn sàng giao hàng.";
  }

  if (order.type === "PRE-ORDER") {
    return 'Operation Staff chỉ tạo phiếu nhập hàng và chuyển đơn sang trạng thái "Chờ duyệt". Manager sẽ duyệt phiếu trước khi đơn được cập nhật thành "Đã nhập hàng".';
  }

  return "Operation Staff đóng gói sản phẩm, kiểm tra hoàn thiện và chuẩn bị bàn giao cho đơn vị vận chuyển.";
}

function getArrayPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function mapInventoryItem(item) {
  const variant = item?.variant || {};
  const product = item?.product || variant?.product || {};

  return {
    id:
      item?.variantId ??
      variant?.variantId ??
      item?.id ??
      item?.inventoryId ??
      item?.productVariantId,
    name:
      item?.productName ??
      product?.productName ??
      item?.variantName ??
      item?.name ??
      item?.sku ??
      "Sản phẩm",
    type:
      item?.categoryName ??
      product?.category?.categoryName ??
      item?.warehouseName ??
      "Tồn kho",
    image:
      item?.image ??
      item?.image2D ??
      product?.image2D ??
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
    stock: Number(
      item?.stock ??
      item?.quantity ??
      item?.currentStock ??
      item?.stockQuantity ??
      item?.availableQuantity ??
      0
    ),
    warehouseId: item?.warehouseId,
    warehouseName: item?.warehouseName,
    sku: item?.sku ?? variant?.sku,
  };
}

function mapWarehouse(item) {
  return {
    id: item?.warehouseId ?? item?.id,
    name:
      item?.warehouseName ??
      item?.name ??
      `Kho ${item?.warehouseId ?? item?.id}`,
  };
}

function mapShippingOption(item, fallbackPrefix) {
  const value =
    item?.code ??
    item?.methodCode ??
    item?.statusCode ??
    item?.name ??
    item?.methodName ??
    item?.statusName ??
    item?.id;

  return {
    value: String(value ?? ""),
    id: item?.shippingMethodId ?? item?.id ?? item?.shippingStatusId,
    label:
      item?.name ??
      item?.methodName ??
      item?.statusName ??
      item?.displayName ??
      `${fallbackPrefix} ${value ?? ""}`.trim(),
  };
}

function normalizeOpsOrderType(order) {
  const isPreOrderFlag =
    order?.isPreOrder === true ||
    order?.isPreOrder === "true" ||
    order?.isPreOrder === 1;

  if (isPreOrderFlag) {
    return "PRE-ORDER";
  }

  const rawType = String(
    order?.type ?? order?.orderType ?? order?.orderCategory ?? ""
  )
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (["pre-order", "preorder"].includes(rawType)) return "PRE-ORDER";

  const hasPrescription =
    order?.hasPrescription === true ||
    order?.prescriptionId ||
    order?.prescription ||
    order?.items?.some?.((item) => item?.prescriptionId) ||
    order?.orderItems?.some?.((item) => item?.prescriptionId);

  if (rawType === "prescription" || hasPrescription) return "PRESCRIPTION";

  return "ORDER";
}

function normalizeOpsOrderStatus(status, type) {
  const rawStatus = String(status || "").toLowerCase();

  if (rawStatus.includes("cancel") || rawStatus.includes("reject")) {
    return "Đã hủy";
  }
  if (rawStatus.includes("confirm")) return "Đã xác nhận";
  if (rawStatus.includes("process")) {
    if (type === "ORDER" || type === "PRE-ORDER") return "Đang đóng gói";
    return "Đang xử lý";
  }
  if (rawStatus.includes("lens") || rawStatus.includes("cut")) {
    return "Đang mài tròng";
  }
  if (rawStatus.includes("assemble")) return "Đang lắp kính";
  if (rawStatus.includes("pack")) return "Sẵn sàng giao hàng";
  if (rawStatus.includes("ready")) return "Sẵn sàng giao hàng";
  if (rawStatus.includes("released")) return "Đang đóng gói";
  if (rawStatus.includes("complete") || rawStatus.includes("done")) {
    return "Hoàn thành";
  }
  if (rawStatus.includes("deliver")) {
    return "Đã giao hàng";
  }
  if (rawStatus.includes("ship") || rawStatus.includes("dispatch")) {
    return "Đang giao hàng";
  }
  if (rawStatus.includes("receive") || rawStatus.includes("import")) {
    return "Đã nhập hàng";
  }
  if (rawStatus.includes("sent_to_ops") || rawStatus.includes("pending") || rawStatus.includes("wait")) {
    return "Chờ nhập hàng";
  }
  if (rawStatus.includes("stock_arrived")) return "Đã báo có hàng";

  return status || "Đã xác nhận";
}

function mapOpsOrder(order) {
  const firstItem =
    order?.item ??
    order?.orderItem ??
    order?.items?.[0] ??
    order?.orderItems?.[0] ??
    {};
  const product = firstItem?.product || firstItem?.variant?.product || {};
  const variant = firstItem?.variant || firstItem?.productVariant || {};
  const orderId = order?.orderId ?? order?.id;

  const type = normalizeOpsOrderType(order);

  return {
    id: order?.orderCode ?? order?.code ?? `VC-${orderId ?? Date.now()}`,
    apiId: orderId,
    customerName:
      order?.customerName ??
      order?.customer?.fullName ??
      order?.user?.fullName ??
      "Khách hàng",
    address:
      order?.shippingAddress ??
      order?.address ??
      order?.customer?.address ??
      "Chưa có địa chỉ",
    type: type,
    total: Number(order?.totalAmount ?? order?.total ?? order?.finalTotal ?? 0),
    status: normalizeOpsOrderStatus(order?.status ?? order?.orderStatus, type),
    carrier: order?.carrier ?? order?.shippingCarrier ?? "",
    trackingCode: order?.trackingCode ?? order?.trackingNumber ?? "",
    item: {
      id:
        firstItem?.variantId ??
        variant?.variantId ??
        firstItem?.productVariantId ??
        firstItem?.productId ??
        product?.productId,
      variantId:
        firstItem?.variantId ??
        variant?.variantId ??
        firstItem?.productVariantId,
      name:
        firstItem?.productName ??
        product?.productName ??
        variant?.productName ??
        firstItem?.name ??
        "Sản phẩm",
      image:
        firstItem?.image ??
        product?.image2D ??
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
      price: Number(firstItem?.unitPrice ?? firstItem?.price ?? 0),
      stock: Number(firstItem?.stockQuantity ?? firstItem?.stock ?? 0),
      brand: product?.brand ?? product?.brandName ?? variant?.product?.brand ?? variant?.product?.brandName ?? firstItem?.brand ?? firstItem?.brandName ?? "",
    },
    items: (order?.items || order?.orderItems || []).map(i => ({
      ...i,
      productName: i?.productName ?? i?.product?.productName ?? i?.variant?.product?.productName ?? i?.name,
      variantInfo: i?.variantInfo ?? i?.variant?.variantName,
      brand: i?.brand ?? i?.brandName ?? i?.product?.brand ?? i?.product?.brandName ?? i?.variant?.product?.brand ?? i?.variant?.product?.brandName ?? "",
    })),
    prescription: order?.prescription ?? firstItem?.prescription ?? null,
    importReceipt: order?.importReceipt ?? order?.receipt ?? null,
  };
}

export default function OperationPage() {
  const [activeNav, setActiveNav] = useState("ORDER_PROCESSING");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [typeFilter, setTypeFilter] = useState("Tất cả");
  const [shippingForm, setShippingForm] = useState({
    carrier: "",
    trackingCode: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInventoryImportOpen, setIsInventoryImportOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [procurementLoading, setProcurementLoading] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [isSubmittingImport, setIsSubmittingImport] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [isSubmittingShipping, setIsSubmittingShipping] = useState(false);
  const [importForm, setImportForm] = useState({
    quantity: "",
    supplier: "",
    supplierId: "",
    warehouseId: "",
    note: "",
  });
  const [inventoryImportForm, setInventoryImportForm] = useState({
    productId: "",
    variantId: "",
    productName: "",
    quantity: "",
    supplierId: "",
    supplier: "",
    warehouseId: "",
    note: "",
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    action: () => { },
  });

  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const isOperationUser = useMemo(() => {
    if (!user) return false;
    if (user.roleId != null) return Number(user.roleId) === 4;
    return ["Operations", "Operation"].includes(user.role);
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }

    if (!isOperationUser) {
      navigate("/");
    }
  }, [isLoggedIn, user, isOperationUser, navigate]);

  const fetchOpsOrderData = useCallback(async () => {
    try {
      setOrdersLoading(true);

      const data =
        activeNav === "PRE_ORDER"
          ? await getPreOrderOrders()
          : await getOpsOrders();

      const mappedOrders = getArrayPayload(data).map(mapOpsOrder);
      setOrders(mappedOrders);
    } catch (error) {
      console.error("Fetch ops orders failed:", error);
      setOrders([]);
      toast.error(error.message || "Khong tai duoc danh sach don Ops.");
    } finally {
      setOrdersLoading(false);
    }
  }, [activeNav]);

  useEffect(() => {
    if (isLoggedIn && user && isOperationUser) {
      fetchOpsOrderData();
    }
  }, [fetchOpsOrderData, isLoggedIn, user, isOperationUser]);

  const fetchShippingMeta = async () => {
    try {
      const [methodsData] = await Promise.all([
        getShippingMethods(),
      ]);

      setShippingMethods(
        getArrayPayload(methodsData)
          .map((item) => mapShippingOption(item, "Phương thức"))
          .filter((item) => item.value)
      );
    } catch (error) {
      console.error("Fetch shipping metadata failed:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user && isOperationUser) {
      fetchShippingMeta();
    }
  }, [isLoggedIn, user, isOperationUser]);

  const fetchInventoryData = async () => {
    try {
      setInventoryLoading(true);

      const [lowStockData, warehouseData, productData] = await Promise.all([
        getLowStock({ threshold: 999999 }).catch(() => []),  // fetch all with high threshold
        getWarehouses().catch(() => []),
        getProducts().catch(() => []),
      ]);

      const mappedWarehouses = getArrayPayload(warehouseData).map(mapWarehouse);

      // Build a stock lookup map from low-stock/inventory data
      const lowStockRaw = getArrayPayload(lowStockData);
      const stockMap = {};
      lowStockRaw.forEach((item) => {
        const vid = item?.variantId ?? item?.productVariantId ?? item?.id;
        if (vid != null) {
          stockMap[String(vid)] = Number(
            item?.quantityAvailable ?? item?.availableQuantity ?? item?.stockQuantity ?? item?.stock ?? item?.quantity ?? item?.currentStock ?? 0
          );
        }
      });

      // Map products from DB as primary source
      const rawProducts = getArrayPayload(productData);
      const mappedInventory = rawProducts.map((p) => {
        const variantId = p?.variants?.[0]?.variantId ?? p?.variantId ?? p?.productId ?? p?.id;
        const stockFromMap = stockMap[String(variantId)];
        const stock = stockFromMap !== undefined
          ? stockFromMap
          : Number(p?.totalStock ?? p?.stock ?? p?.stockQuantity ?? p?.availableQuantity ?? 0);

        return {
          id: p?.productId ?? p?.id,
          variantId,
          name: p?.productName ?? p?.name ?? "San pham",
          type: p?.category?.categoryName ?? p?.categoryName ?? p?.type ?? "San pham",
          image:
            p?.image2D ??
            p?.image ??
            p?.variants?.[0]?.image ??
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
          stock,
          warehouseId: p?.warehouseId,
          warehouseName: p?.warehouseName,
          sku: p?.sku ?? p?.variants?.[0]?.sku,
        };
      }).filter((p) => p.id);

      // Also build dropdown products list for the import form
      const mappedProducts = rawProducts.map((p) => ({
        id: p?.productId ?? p?.ProductId ?? p?.id,
        variantId: p?.variants?.[0]?.variantId ?? p?.variantId ?? p?.productId ?? p?.ProductId ?? p?.id,
        name: p?.productName ?? p?.ProductName ?? p?.name ?? "San pham",
        brand: p?.brand ?? p?.Brand ?? "",
      })).filter((p) => p.id);

      // If products API works, use it; otherwise fall back to lowStock-only items
      if (mappedInventory.length > 0) {
        setInventoryItems(mappedInventory);
      } else if (lowStockRaw.length > 0) {
        setInventoryItems(lowStockRaw.map(mapInventoryItem));
      } else {
        setInventoryItems([]);
      }

      setWarehouses(mappedWarehouses);
      setProducts(mappedProducts);

      const uniqueBrands = Array.from(new Set(rawProducts.map(p => p.brand || p.Brand).filter(Boolean))).map(brand => ({
        id: brand,
        name: brand
      }));
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Fetch ops inventory failed:", error);
      setInventoryItems([]);
      toast.error(error.message || "Khong tai duoc du lieu kho.");
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user && isOperationUser) {
      fetchInventoryData();
    }
  }, [isLoggedIn, user, isOperationUser]);

  const fetchProcurementData = async () => {
    try {
      setProcurementLoading(true);
      const data = await getReceipts();
      setReceipts(data || []);
    } catch (error) {
      console.error("Fetch receipts failed:", error);
    } finally {
      setProcurementLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user && isOperationUser) {
      fetchProcurementData();
    }
  }, [isLoggedIn, user, isOperationUser]);

  useEffect(() => {
    return () => {
      previewImages.forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [previewImages]);

  if (!isLoggedIn || !user || !isOperationUser) {
    return null;
  }

  const processingOrders = orders.filter((order) =>
    [
      "Đã xác nhận",
      "Đang xử lý",
      "Đang mài tròng",
      "Đang lắp kính",
      "Đã nhập hàng",
      "Đang đóng gói",
      "Sẵn sàng giao hàng",
    ].includes(order.status)
  );

  const preOrderOrders = orders.filter((order) => order.type === "PRE-ORDER");

  const deliveryOrders = orders.filter((order) =>
    ["Sẵn sàng giao hàng", "Đang giao hàng", "Đã giao hàng", "Hoàn thành"].includes(
      order.status
    )
  );

  const baseOrders =
    activeNav === "ORDER_PROCESSING"
      ? processingOrders
      : activeNav === "PRE_ORDER"
        ? preOrderOrders
        : deliveryOrders;

  const filteredOrders =
    activeNav === "INVENTORY"
      ? inventoryItems
      : typeFilter === "Tất cả"
        ? baseOrders
        : baseOrders.filter((order) => order.type === typeFilter);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenOrder = async (order) => {
    setSelectedOrder({ ...order, _loading: true });
    setShippingForm({
      carrier: order.carrier && order.carrier !== "Chưa chọn" ? order.carrier : "",
      trackingCode: order.trackingCode && order.trackingCode !== "—" ? order.trackingCode : "",
    });
    setPreviewImages([]);

    try {
      if (!order.apiId) {
        console.warn("Order apiId is missing, cannot fetch details");
        setSelectedOrder({ ...order, _loading: false });
        return;
      }
      const detail = await getOpsOrderDetail(order.apiId, order.isPreOrder);

      const firstDetailItem = detail?.items?.[0] || {};
      const updatedItem = detail?.items?.length ? {
        ...order.item,
        name: firstDetailItem.productName,
        price: firstDetailItem.unitPrice,
        variantInfo: firstDetailItem.variantInfo
      } : order.item;

      setSelectedOrder({
        ...order,
        address: detail?.shippingAddress || order.address,
        staffNote: detail?.staffNote || order.staffNote,
        packedAt: detail?.packedAt,
        item: updatedItem,
        items: detail?.items || [],
        _loading: false
      });
    } catch (error) {
      console.error("Fetch ops order detail failed:", error);
      toast.error(error.message || "Không tải được chi tiết đơn hàng.");
      setSelectedOrder({ ...order, _loading: false });
    }
  };

  const handleCloseOrder = () => {
    previewImages.forEach((img) => {
      if (img.preview) URL.revokeObjectURL(img.preview);
    });
    setSelectedOrder(null);
    setShippingForm({
      carrier: "",
      trackingCode: "",
    });
    setPreviewImages([]);
  };

  const handleShippingChange = (field, value) => {
    setShippingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadImages = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
    setPreviewImages((prev) => [...prev, ...mapped]);
  };

  const handleRemovePreview = (index) => {
    setPreviewImages((prev) => {
      const clone = [...prev];
      if (clone[index]?.preview) {
        URL.revokeObjectURL(clone[index].preview);
      }
      clone.splice(index, 1);
      return clone;
    });
  };

  const handleUpdateProcessingStatus = async () => {
    if (!selectedOrder) return;

    const nextStatus =
      selectedOrder.status === "Đã xác nhận" && selectedOrder.type === "PRESCRIPTION"
        ? "Đang đóng gói"
        : selectedOrder.status === "Đang xử lý"
          ? selectedOrder.type === "PRE-ORDER"
            ? "Chờ nhập hàng"
            : "Đang đóng gói"
          : getProcessingNextStatus(selectedOrder.status, selectedOrder.type);

    if (nextStatus === selectedOrder.status) {
      toast("Đơn này không có bước xử lý nội bộ tiếp theo.");
      return;
    }

    const backendStatusMap = {
      "Đã xác nhận": "Confirmed",
      "Đang xử lý": "Processing",
      "Đang mài tròng": "Processing",
      "Đang lắp kính": "Processing",
      "Đang đóng gói": "Processing",
      "Sẵn sàng giao hàng": "Packed",
      "Chờ nhập hàng": "Pending",
      "Đã nhập hàng": "Processing"
    };

    setConfirmModal({
      isOpen: true,
      title: "Cập nhật trạng thái",
      message: `Bạn chắc chắn muốn chuyển trạng thái đơn hàng sang "${nextStatus}"?`,
      confirmText: "Xác nhận chuyển",
      action: async () => {
        try {
          const backendStatus = backendStatusMap[nextStatus] || "Processing";

          if (selectedOrder.apiId) {
            if (backendStatus === "Packed") {
              await packOrder(selectedOrder.apiId);
            } else {
              await updateOrderStatus(selectedOrder.apiId, {
                status: backendStatus,
                newStatus: backendStatus,
                note: "Operation cập nhật trạng thái",
              });
            }
          }

          const updatedOrder = {
            ...selectedOrder,
            status: nextStatus,
          };

          setSelectedOrder(updatedOrder);
          setOrders((prev) =>
            prev.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
          );

          if (backendStatusMap[nextStatus] === "Packed") {
            setTypeFilter(ORDER_TYPES[0]);
            setActiveNav("DELIVERY");
          }

          toast.success(`Đã chuyển trạng thái sang "${nextStatus}"`);
        } catch (error) {
          console.error("Update ops order status failed:", error);
          toast.error(error.message || "Không cập nhật được trạng thái đơn.");
        }
      }
    });
  };

  const handleUpdateDeliveryStatus = async () => {
    if (!selectedOrder) return;

    const nextStatus = getDeliveryNextStatus(selectedOrder.status);

    if (nextStatus === selectedOrder.status) {
      toast(
        "Operation Staff chỉ cập nhật đơn trạng thái đang giao hàng. Khách hàng sẽ xác nhận hoàn thiện."
      );
      return;
    }

    if (
      selectedOrder.status === "Sẵn sàng giao hàng" &&
      !shippingForm.carrier.trim()
    ) {
      toast.error("Vui lòng chọn đơn vị vận chuyển.");
      return;
    }

    if (
      selectedOrder.status === "Sẵn sàng giao hàng" &&
      !shippingForm.trackingCode.trim()
    ) {
      toast.error("Vui lòng nhập mã vận đơn.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "Cập nhật trạng thái giao hàng",
      message: `Xác nhận chuyển trạng thái đơn hàng sang "${nextStatus}"?`,
      confirmText: "Xác nhận",
      action: async () => {
        try {
          setIsSubmittingShipping(true);

          if (selectedOrder.apiId && selectedOrder.status === "Sẵn sàng giao hàng") {
            const selectedMethod = shippingMethods.find(m => m.value === shippingForm.carrier) || { id: 1 };

            await createShippingOrder(selectedOrder.apiId, {
              shippingMethodId: Number(selectedMethod.id),
              carrier: shippingForm.carrier,
              methodCode: shippingForm.carrier,
              shippingMethod: shippingForm.carrier,
              trackingCode: shippingForm.trackingCode,
              trackingNo: shippingForm.trackingCode,
              note: "Operation tạo đơn vận chuyển",
            });

            await markAsShipped(selectedOrder.apiId);
          } else if (selectedOrder.apiId && selectedOrder.status === "Đã giao hàng") {
            await updateOrderStatus(selectedOrder.apiId, {
              status: "Completed",
              newStatus: "Completed",
              note: "Operation xác nhận hoàn thành sau khi khách đã nhận hàng",
            });
          }

          const updatedOrder = {
            ...selectedOrder,
            carrier: shippingForm.carrier,
            trackingCode: shippingForm.trackingCode,
            status: nextStatus,
          };

          setSelectedOrder(updatedOrder);
          setOrders((prev) =>
            prev.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
          );

          toast.success(`Đã chuyển trạng thái sang "${nextStatus}"`);
        } catch (error) {
          console.error("Create shipping flow failed:", error);
          toast.error(error.message || "Không khởi tạo được luồng giao hàng.");
        } finally {
          setIsSubmittingShipping(false);
        }
      }
    });
  };

  const handleOpenImportModal = () => {
    if (!selectedOrder) return;

    // Calculate total quantity from order items
    const totalQuantity = (selectedOrder.items && selectedOrder.items.length > 0)
      ? selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)
      : (selectedOrder.item?.quantity || 1);

    // Determine the default brand from items or the main item
    let productBrand = (selectedOrder.items && selectedOrder.items.length > 0)
      ? selectedOrder.items[0].brand
      : selectedOrder.item?.brand;

    // Heuristic: if brand property is missing, try to match from name
    if (!productBrand || productBrand === "") {
      const productName = (selectedOrder.items && selectedOrder.items.length > 0)
        ? selectedOrder.items[0].productName
        : selectedOrder.item?.name;

      if (productName) {
        const foundBrand = brands.find(b =>
          productName.toLowerCase().startsWith(b.name.toLowerCase()) ||
          productName.toLowerCase().includes(b.name.toLowerCase())
        );
        if (foundBrand) productBrand = foundBrand.name;
      }
    }

    const matchedBrand = brands.find(b =>
      String(b.id).toLowerCase() === String(productBrand || "").toLowerCase() ||
      String(b.name).toLowerCase() === String(productBrand || "").toLowerCase()
    );

    setImportForm({
      quantity: totalQuantity,
      supplier: matchedBrand?.name || productBrand || brands[0]?.name || "",
      supplierId: matchedBrand?.id ? String(matchedBrand.id) : (productBrand || brands[0]?.id ? String(brands[0].id) : ""),
      warehouseId: warehouses[0]?.id ? String(warehouses[0].id) : "1",
      note: `Nhập hàng cho đơn ${selectedOrder.id}`,
    });
    setIsImportModalOpen(true);
  };

  const handleOpenInventoryImportModal = () => {
    setInventoryImportForm({
      productId: "",
      variantId: "",
      productName: "",
      quantity: "",
      supplierId: brands[0]?.id ? String(brands[0].id) : "",
      supplier: brands[0]?.name || "",
      warehouseId: warehouses[0]?.id ? String(warehouses[0].id) : "",
      note: "",
    });
    setIsInventoryImportOpen(true);
  };

  const handleCreateInventoryImportRequest = async () => {
    if (!String(inventoryImportForm.quantity).trim() || Number(inventoryImportForm.quantity) <= 0) {
      toast.error("Vui lòng nhập số lượng nhập hợp lệ.");
      return;
    }
    if (!inventoryImportForm.variantId) {
      toast.error("Vui lòng chọn sản phẩm.");
      return;
    }
    if (!inventoryImportForm.supplierId) {
      toast.error("Vui lòng chọn nhà cung cấp.");
      return;
    }
    try {
      setIsSubmittingImport(true);
      const payload = {
        warehouseId: inventoryImportForm.warehouseId ? Number(inventoryImportForm.warehouseId) : 1,
        note: inventoryImportForm.note || `Yêu cầu nhập: ${inventoryImportForm.productName}`,
        items: [
          {
            variantId: Number(inventoryImportForm.variantId),
            quantity: Number(inventoryImportForm.quantity),
            unitPrice: 0,
          },
        ],
      };
      await createPurchaseRequest(payload);
      toast.success("Đã gửi yêu cầu nhập hàng lên Manager.");
      setIsInventoryImportOpen(false);
      await fetchProcurementData();
    } catch (error) {
      console.error("Create inventory PR failed:", error);
      toast.error(error.message || "Không tạo được yêu cầu nhập hàng.");
    } finally {
      setIsSubmittingImport(false);
    }
  };

  const handleCreateImportReceipt = async () => {
    if (!selectedOrder) return;

    if (
      !String(importForm.quantity).trim() ||
      Number(importForm.quantity) <= 0
    ) {
      toast.error("Vui lòng nhập số lượng nhập hợp lệ.");
      return;
    }

    if (!String(importForm.supplier).trim()) {
      toast.error("Vui lòng nhập nhà cung cấp.");
      return;
    }

    if (warehouses.length > 0 && !String(importForm.warehouseId).trim()) {
      toast.error("Vui lòng chọn kho nhập hàng.");
      return;
    }

    const quantity = Number(importForm.quantity);
    const items = (selectedOrder.items && selectedOrder.items.length > 0)
      ? selectedOrder.items.map(item => ({
        variantId: Number(item.variantId || item.id),
        quantity: Number(item.quantity),
        unitPrice: 0
      }))
      : (selectedOrder.item?.variantId || selectedOrder.item?.id)
        ? [
          {
            variantId: Number(selectedOrder.item?.variantId || selectedOrder.item?.id),
            quantity: quantity,
            unitPrice: 0
          }
        ]
        : [];

    if (items.length === 0) {
      toast.error("Không tìm thấy variantId sản phẩm.");
      return;
    }

    try {
      setIsSubmittingImport(true);

      const payload = {
        warehouseId: importForm.warehouseId ? Number(importForm.warehouseId) : 1,
        note: importForm.note,
        items: items
      };

      await createPurchaseRequest(payload);

      toast.success("Đã tạo phiếu yêu cầu nhập hàng (PR). Chờ Manager duyệt.");
      setIsImportModalOpen(false);
      await fetchProcurementData();
    } catch (error) {
      console.error("Create PR failed:", error);
      toast.error(error.message || "Không tạo được phiếu yêu cầu nhập hàng.");
    } finally {
      setIsSubmittingImport(false);
    }
  };

  const handleSubmitEvidence = async () => {
    if (!selectedReceipt || !evidenceUrl.trim()) {
      toast.error("Vui lòng nhập link ảnh bằng chứng.");
      return;
    }

    try {
      setProcurementLoading(true);
      await submitEvidence(selectedReceipt.goodsReceiptId, {
        proofImage: evidenceUrl,
        note: "Ops đã tải bằng chứng hàng về."
      });
      toast.success("Đã gửi bằng chứng. Chờ Manager xác nhận nhập kho.");
      setIsProcurementModalOpen(false);
      setEvidenceUrl("");
      await fetchProcurementData();
    } catch (error) {
      toast.error(error.message || "Lỗi khi gửi bằng chứng.");
    } finally {
      setProcurementLoading(false);
    }
  };

  const ProcurementStatusBadge = ({ status }) => {
    const styles = {
      PendingApproval: "bg-orange-50 text-orange-600 border-orange-200",
      Approved: "bg-blue-50 text-blue-600 border-blue-200",
      AwaitingConfirmation: "bg-purple-50 text-purple-600 border-purple-200",
      Completed: "bg-green-50 text-green-600 border-green-200",
      Cancelled: "bg-red-50 text-red-600 border-red-200",
    };

    const labels = {
      PendingApproval: "Chờ duyệt",
      Approved: "Đang chờ hàng",
      AwaitingConfirmation: "Chờ xác nhận kho",
      Completed: "Đã nhập kho",
      Cancelled: "Đã hủy",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.PendingApproval}`}>
        {labels[status] || status}
      </span>
    );
  };

  const isProcessingModal =
    selectedOrder &&
    [
      "Đã xác nhận",
      "Đang xử lý",
      "Đang mài tròng",
      "Đang lắp kính",
      "Đã nhập hàng",
      "Đang đóng gói",
      "Sẵn sàng giao hàng",
    ].includes(selectedOrder.status) &&
    activeNav === "ORDER_PROCESSING";

  const isPreOrderModal =
    selectedOrder &&
    selectedOrder.type === "PRE-ORDER" &&
    activeNav === "PRE_ORDER";

  const isDeliveryModal =
    selectedOrder &&
    ["Sẵn sàng giao hàng", "Đang giao hàng", "Đã giao hàng", "Hoàn thành"].includes(
      selectedOrder.status
    ) &&
    activeNav === "DELIVERY";

  const processList = selectedOrder ? getProcessList(selectedOrder) : [];
  const currentProcessIndex = selectedOrder
    ? processList.indexOf(selectedOrder.status)
    : -1;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8fb]">
      <OperationSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-7">
          <div className="flex items-center gap-4">
            <button className="text-slate-600 transition hover:text-slate-900">
              <ChevronLeft size={20} />
            </button>
            <p className="text-[18px] font-semibold text-slate-800">
              Operations
            </p>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-500 transition hover:text-slate-700">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-7 py-8">
          <div className="mb-8 rounded-[24px] border border-slate-200 bg-[#eef3fb] px-6 py-5">
            <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-[#3b82f6]">
              <Settings2 size={16} />
              <span>Quy trình theo loại đơn:</span>
            </div>

            <div className="space-y-2 text-[16px] text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">
                  • Gọng + Tròng:
                </span>{" "}
                Mài tròng → Lắp kính → Kiểm tra CL → Đóng gói → Sẵn sàng giao
                hàng → Nhập mã vận đơn
              </p>
              <p>
                <span className="font-semibold text-slate-700">
                  • Pre-order:
                </span>{" "}
                Chờ nhập hàng → Tạo phiếu nhập hàng → Chờ duyệt → Manager duyệt
                → Đã nhập hàng → Đóng gói → Sẵn sàng giao hàng
              </p>
              <p>
                <span className="font-semibold text-slate-700">
                  • Kính mắt / PK:
                </span>{" "}
                Đóng gói → Sẵn sàng giao hàng → Nhập mã vận đơn
              </p>
            </div>
          </div>

          {activeNav !== "INVENTORY" && (
            <div className="mb-8 flex w-fit flex-wrap gap-3 rounded-[18px] bg-slate-100 p-2">
              {ORDER_TYPES.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTypeFilter(filter)}
                  className={`rounded-[14px] px-5 py-3 text-[15px] font-semibold transition ${typeFilter === filter
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  {filter}
                  {filter === "Tất cả" ? ` (${baseOrders.length})` : ""}
                </button>
              ))}
            </div>
          )}

          {activeNav === "INVENTORY" ? (
            <div className="space-y-8">
              {/* Inventory Table */}
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Warehouse size={20} className="text-slate-700" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      Kho sản phẩm
                    </h2>
                  </div>
                  <button
                    onClick={handleOpenInventoryImportModal}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 shadow-sm"
                  >
                    <ClipboardList size={16} />
                    Tạo yêu cầu nhập hàng
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-[18px] text-slate-500">
                        <th className="px-6 py-5 font-medium">Sản phẩm</th>
                        <th className="px-6 py-5 font-medium">Loại</th>
                        <th className="px-6 py-5 font-medium">Tồn kho</th>
                        <th className="px-6 py-5 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryLoading && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-8 text-center text-slate-500"
                          >
                            Đang tải dữ liệu kho...
                          </td>
                        </tr>
                      )}

                      {!inventoryLoading && inventoryItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-8 text-center text-slate-500"
                          >
                            Không có sản phẩm tồn kho thấp.
                          </td>
                        </tr>
                      )}

                      {!inventoryLoading && inventoryItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 text-[17px] last:border-b-0"
                        >
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-14 w-14 rounded-xl object-cover"
                              />
                              <span className="font-semibold text-slate-900">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-slate-700">{item.type}</td>
                          <td className="px-6 py-6 font-semibold text-slate-900">
                            {item.stock}
                          </td>
                          <td className="px-6 py-6">
                            <span
                              className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${item.stock > 0
                                ? "border border-green-200 bg-green-50 text-green-700"
                                : "border border-red-200 bg-red-50 text-red-600"
                                }`}
                            >
                              {item.stock > 0 ? "Còn hàng" : "Hết hàng"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Procurement Receipts Table */}
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ClipboardList size={20} className="text-slate-700" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      Quản lý Nhập hàng (Procurement)
                    </h2>
                  </div>
                  <button
                    onClick={fetchProcurementData}
                    className="text-sm text-slate-500 hover:text-slate-800 transition"
                  >
                    Làm mới
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-[17px] text-slate-500">
                        <th className="px-6 py-5 font-medium">Mã phiếu</th>
                        <th className="px-6 py-5 font-medium">Ngày tạo</th>
                        <th className="px-6 py-5 font-medium">Trạng thái</th>
                        <th className="px-6 py-5 text-right font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procurementLoading && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            Đang tải phiếu nhập...
                          </td>
                        </tr>
                      )}
                      {!procurementLoading && receipts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            Chưa có phiếu nhập hàng nào.
                          </td>
                        </tr>
                      )}
                      {!procurementLoading && receipts.map((r) => (
                        <tr key={r.goodsReceiptId} className="border-b border-slate-100 text-[16px] hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-6 font-semibold text-slate-900">{r.receiptCode}</td>
                          <td className="px-6 py-6 text-slate-600">
                            {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-6">
                            <ProcurementStatusBadge status={r.status} />
                          </td>
                          <td className="px-6 py-6 text-right">
                            <button
                              onClick={() => {
                                setSelectedReceipt(r);
                                setIsProcurementModalOpen(true);
                              }}
                              className="text-slate-400 hover:text-slate-900 p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-[18px] text-slate-500">
                      <th className="px-6 py-5 font-medium">Mã đơn</th>
                      <th className="px-6 py-5 font-medium">Khách hàng</th>
                      <th className="px-6 py-5 font-medium">Loại</th>
                      <th className="px-6 py-5 font-medium">Tổng tiền</th>
                      <th className="px-6 py-5 font-medium">Trạng thái</th>
                      <th className="px-6 py-5 text-right font-medium">
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {ordersLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-10 text-center text-slate-500"
                        >
                          Đang tải danh sách đơn...
                        </td>
                      </tr>
                    )}

                    {!ordersLoading && filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-slate-100 text-[17px] last:border-b-0"
                      >
                        <td className="px-6 py-6 font-semibold text-slate-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-6 text-slate-900">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold tracking-wide uppercase shadow-sm border ${order.type === "PRE-ORDER"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : order.type === "PRESCRIPTION"
                                ? "bg-teal-50 text-teal-700 border-teal-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                          >
                            {order.type}
                          </span>
                        </td>
                        <td className="px-6 py-6 font-semibold text-slate-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-6">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-4 py-1.5 text-[15px] font-semibold ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => handleOpenOrder(order)}
                              className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-50"
                            >
                              <Eye size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!ordersLoading && filteredOrders.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-10 text-center text-slate-500"
                        >
                          Không có dữ liệu phù hợp
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-8 py-5">
              <h2 className="text-[22px] font-bold text-slate-900">
                Chi tiết đơn {selectedOrder.id}
              </h2>

              <button
                onClick={handleCloseOrder}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={22} />
              </button>
            </div>

            {/* BODY */}
            <div className={`grid min-h-0 flex-1 grid-cols-1 ${(isProcessingModal || isDeliveryModal || isPreOrderModal) ? "lg:grid-cols-[1.5fr_0.9fr]" : ""}`}>
              {/* LEFT */}
              <div className="min-h-0 overflow-y-auto px-8 py-6">
                {/* STEPPER */}
                <div className="mb-8 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
                  <div className="flex items-center justify-between gap-2">
                    {processList.map((step, index) => {
                      const completed = index < currentProcessIndex;
                      const active = index === currentProcessIndex;
                      const isReached = completed || active;

                      return (
                        <div
                          key={step}
                          className="relative flex flex-1 flex-col items-center group"
                        >
                          {index < processList.length - 1 && (
                            <div
                              className={`absolute left-[60%] top-4 h-[2px] w-[80%] transition-colors duration-300 ${index < currentProcessIndex
                                ? "bg-amber-400"
                                : "bg-slate-200"
                                }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${active
                              ? "bg-amber-500 text-white ring-4 ring-amber-100 scale-110"
                              : completed
                                ? "bg-amber-400 text-white"
                                : "bg-white text-slate-400 border-2 border-slate-200"
                              }`}
                          >
                            {completed ? <CheckCircle2 size={16} /> : index + 1}
                          </div>

                          <p className={`mt-3 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${active ? "text-amber-600" : isReached ? "text-slate-600" : "text-slate-400"
                            }`}>
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CUSTOMER INFO */}
                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="mb-1 text-sm text-slate-500">Khách hàng</p>
                    <p className="text-2xl font-semibold text-slate-900">
                      {selectedOrder.customerName}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="mb-1 text-sm text-slate-500">Địa chỉ</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>

                {/* TASK */}
                <div className="mb-6 overflow-hidden rounded-3xl border border-blue-100 bg-blue-50/30 shadow-sm">
                  <div className="flex items-center gap-3 bg-blue-50 px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-md shadow-blue-200">
                      <Settings2 size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-blue-900">Nhiệm vụ vận hành</h3>
                  </div>

                  <div className="px-6 py-5">
                    <p className="text-[15px] leading-relaxed text-slate-700">
                      {getOperationTask(selectedOrder)}
                    </p>

                    {selectedOrder.type === "PRE-ORDER" &&
                      selectedOrder.status === "Chờ nhập hàng" && (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white border border-orange-200 p-4 shadow-sm">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <AlertCircle size={18} />
                          </div>
                          <p className="text-sm font-semibold text-orange-800">
                            Hệ thống yêu cầu tạo phiếu nhập hàng để tiếp tục quy trình.
                          </p>
                        </div>
                      )}

                    {selectedOrder.type === "PRE-ORDER" &&
                      selectedOrder.status === "Chờ duyệt" && (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 animate-pulse">
                            <Clock3 size={18} />
                          </div>
                          <span className="text-sm font-bold text-amber-800">
                            Phiếu nhập đang chờ Manager duyệt
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="mb-5 space-y-3">
                  {(selectedOrder.items && selectedOrder.items.length > 0) ? (
                    selectedOrder.items.map((prod, idx) => (
                      <div key={idx} className="rounded-3xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                              <Package size={24} className="text-slate-400" />
                            </div>

                            <div>
                              <p className="text-xl font-medium text-slate-900">
                                {prod.productName}
                              </p>
                              {prod.variantInfo && (
                                <p className="text-sm text-slate-500">
                                  Phân loại: {prod.variantInfo}
                                </p>
                              )}
                              <p className="text-sm text-slate-500 mt-1">
                                Số lượng: <span className="font-semibold text-slate-700">{prod.quantity}</span>
                              </p>
                            </div>
                          </div>

                          <p className="text-xl font-semibold text-slate-900">
                            {formatCurrency(prod.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                            <img
                              src={selectedOrder.item?.image}
                              alt={selectedOrder.item?.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div>
                            <p className="text-xl font-medium text-slate-900">
                              {selectedOrder.item?.name}
                            </p>
                          </div>
                        </div>

                        <p className="text-xl font-semibold text-slate-900">
                          {formatCurrency(selectedOrder.item?.price)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* IMPORT RECEIPT */}
                {selectedOrder.importReceipt && (
                  <div className="mb-5 rounded-3xl bg-yellow-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <ClipboardList size={20} className="text-yellow-700" />
                      <h3 className="text-xl font-semibold text-yellow-800">
                        Phiếu nhập hàng
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-base text-slate-800 md:grid-cols-2">
                      <p>Mã phiếu: {selectedOrder.importReceipt.receiptCode}</p>
                      <p>Số lượng: {selectedOrder.importReceipt.quantity}</p>
                      <p>Nhà cung cấp: {selectedOrder.importReceipt.supplier}</p>
                      <p>Ngày tạo: {selectedOrder.importReceipt.createdAt}</p>
                      <p>
                        Trạng thái phiếu:{" "}
                        {selectedOrder.importReceipt.status === "Pending"
                          ? "Chờ duyệt"
                          : selectedOrder.importReceipt.status}
                      </p>
                      {selectedOrder.importReceipt.note && (
                        <p className="md:col-span-2">
                          Ghi chú: {selectedOrder.importReceipt.note}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* PRESCRIPTION */}
                {selectedOrder.prescription && (
                  <div className="mb-5 rounded-3xl bg-teal-50 p-5">
                    <h3 className="mb-4 text-xl font-semibold text-teal-800">
                      Thông tin toa kính
                    </h3>

                    <div className="grid grid-cols-1 gap-3 text-lg text-slate-800 md:grid-cols-2">
                      <p>L-SPH: {selectedOrder.prescription.leftSPH}</p>
                      <p>R-SPH: {selectedOrder.prescription.rightSPH}</p>
                      <p>PD: {selectedOrder.prescription.pd}</p>
                      <p>Loại tròng: {selectedOrder.prescription.lensType}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT ACTION PANEL */}
              <div className="min-h-0 border-t border-slate-200 bg-slate-50 px-6 py-6 lg:border-l lg:border-t-0">
                <div className="sticky top-0 space-y-5">
                  {/* Processing */}
                  {isProcessingModal && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center gap-3">
                        <Package size={20} className="text-slate-700" />
                        <h3 className="text-lg font-semibold text-slate-900">
                          Xử lý nội bộ
                        </h3>
                      </div>

                      <p className="mb-4 text-sm leading-7 text-slate-600">
                        Upload ảnh sản phẩm / đóng gói để lưu minh chứng xử lý.
                      </p>

                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 bg-white px-4 py-8 text-center transition hover:bg-teal-50">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleUploadImages}
                          className="hidden"
                        />
                        <Upload size={28} className="mb-2 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">
                          Kéo thả hoặc click để upload
                        </span>
                      </label>

                      {previewImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {previewImages.map((img, index) => (
                            <div
                              key={`${img.name}-${index}`}
                              className="relative overflow-hidden rounded-2xl border border-slate-200"
                            >
                              <img
                                src={img.preview}
                                alt={img.name}
                                className="h-24 w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePreview(index)}
                                className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white"
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pre-order Actions */}
                  {selectedOrder.type === "PRE-ORDER" &&
                    !["Đang đóng gói", "Sẵn sàng giao hàng", "Đang giao hàng", "Đã giao hàng", "Hoàn thành"].includes(selectedOrder.status) && (
                      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3 text-slate-800">
                          <ClipboardList size={20} className="text-purple-600" />
                          <h3 className="text-lg font-bold">Xử lý nhập hàng</h3>
                        </div>

                        {selectedOrder.status === "Chờ nhập hàng" ? (
                          <div className="space-y-4">
                            <p className="text-sm leading-relaxed text-slate-500">
                              Sản phẩm này hiện không có sẵn trong kho. Vui lòng tạo phiếu nhập hàng để gửi yêu cầu cho cấp trên.
                            </p>
                            <button
                              onClick={handleOpenImportModal}
                              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Plus size={20} className="transition-transform group-hover:rotate-90" />
                              Tạo phiếu nhập hàng
                            </button>
                          </div>
                        ) : selectedOrder.status === "Chờ duyệt" ? (
                          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 border-dashed text-center">
                            <p className="text-sm font-medium text-slate-500 italic">
                              Yêu cầu đã được gửi. Đang đợi Manager xử lý...
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 font-bold justify-center py-2">
                            <CheckCircle2 size={20} />
                            <span>Hàng đã về kho</span>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Delivery */}
                  {isDeliveryModal && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center gap-3">
                        <Truck className="text-slate-700" size={20} />
                        <h3 className="text-lg font-semibold text-slate-900">
                          Giao hàng
                        </h3>
                      </div>

                      <p className="mb-4 text-sm leading-7 text-slate-600">
                        Nhập đơn vị vận chuyển và mã vận đơn trước khi bàn giao.
                      </p>

                      {selectedOrder.status === "Sẵn sàng giao hàng" && (
                        <>
                          <select
                            value={shippingForm.carrier}
                            onChange={(e) =>
                              handleShippingChange("carrier", e.target.value)
                            }
                            className="w-full rounded-2xl border-2 border-teal-500 bg-white px-4 py-3 text-base outline-none"
                          >
                            <option value="">Chọn đơn vị vận chuyển</option>
                            {(shippingMethods.length
                              ? shippingMethods
                              : [
                                { value: "GHTK", label: "GHTK" },
                                { value: "GHN", label: "GHN" },
                                { value: "Viettel Post", label: "Viettel Post" },
                                { value: "J&T Express", label: "J&T Express" },
                              ]
                            ).map((method) => (
                              <option key={method.value} value={method.value}>
                                {method.label}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            value={shippingForm.trackingCode}
                            onChange={(e) =>
                              handleShippingChange("trackingCode", e.target.value)
                            }
                            placeholder="Nhập mã vận đơn"
                            className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-slate-400"
                          />
                        </>
                      )}

                      {selectedOrder.status === "Đang giao hàng" && (
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-700 leading-relaxed">
                          Đơn đang giao tới khách. Chờ khách xác nhận đã nhận hàng trên trang đơn hàng.
                        </div>
                      )}

                      {selectedOrder.status === "Đã giao hàng" && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                          Khách hàng đã xác nhận nhận hàng. Operation có thể xác nhận hoàn thành đơn.
                        </div>
                      )}

                      {selectedOrder.status === "Hoàn thành" && (
                        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
                          Đơn hàng đã hoàn thành.
                        </div>
                      )}
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleCloseOrder}
                        className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Đóng
                      </button>

                      {isProcessingModal &&
                        !(selectedOrder.type === "PRE-ORDER" &&
                          ["Chờ nhập hàng", "Chờ duyệt"].includes(
                            selectedOrder.status
                          )) && (
                          <button
                            type="button"
                            onClick={handleUpdateProcessingStatus}
                            disabled={selectedOrder.status === "Sẵn sàng giao hàng"}
                            className={`rounded-2xl px-5 py-3 font-semibold text-white transition ${selectedOrder.status === "Sẵn sàng giao hàng"
                              ? "cursor-not-allowed bg-slate-300"
                              : "bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90"
                              }`}
                          >
                            {selectedOrder.status === "Sẵn sàng giao hàng"
                              ? "Đã sẵn sàng giao hàng"
                              : "Chuyển sang bước tiếp theo"}
                          </button>
                        )}

                      {isDeliveryModal && (
                        <button
                          type="button"
                          onClick={handleUpdateDeliveryStatus}
                          disabled={
                            selectedOrder.status === "Đang giao hàng" ||
                            selectedOrder.status === "Hoàn thành" ||
                            isSubmittingShipping
                          }
                          className={`rounded-2xl px-5 py-3 font-semibold text-white transition ${selectedOrder.status === "Đang giao hàng" ||
                            selectedOrder.status === "Hoàn thành"
                            ? "cursor-not-allowed bg-slate-300"
                            : "bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90"
                            }`}
                        >
                          {selectedOrder.status === "Sẵn sàng giao hàng" &&
                            "Bắt đầu giao hàng"}
                          {selectedOrder.status === "Đang giao hàng" &&
                            "Chờ khách xác nhận"}
                          {selectedOrder.status === "Đã giao hàng" &&
                            "Xác nhận hoàn thành"}
                          {selectedOrder.status === "Hoàn thành" && "Đã hoàn thành"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isImportModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">
                Tạo phiếu nhập hàng
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 transition hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Sản phẩm
                </label>
                <input
                  type="text"
                  value={selectedOrder.item?.name || ""}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Số lượng nhập
                </label>
                <input
                  type="number"
                  value={importForm.quantity}
                  onChange={(e) =>
                    setImportForm((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  placeholder="Nhập số lượng"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>

              {warehouses.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Kho nhập hàng
                  </label>
                  <select
                    value={importForm.warehouseId}
                    onChange={(e) =>
                      setImportForm((prev) => ({
                        ...prev,
                        warehouseId: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                  >
                    <option value="">Chọn kho nhập hàng</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Thương hiệu / Nhà cung cấp
                </label>
                {brands.length > 0 ? (
                  <select
                    value={importForm.supplierId}
                    onChange={(e) => {
                      const supplier = brands.find(
                        (item) => String(item.id) === e.target.value
                      );
                      setImportForm((prev) => ({
                        ...prev,
                        supplierId: e.target.value,
                        supplier: supplier?.name || "",
                      }));
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {(importForm.supplierId || importForm.supplier
                      ? brands.filter(b =>
                        (importForm.supplierId && String(b.id).toLowerCase() === String(importForm.supplierId).toLowerCase()) ||
                        (importForm.supplier && String(b.name).toLowerCase() === String(importForm.supplier).toLowerCase())
                      )
                      : brands
                    ).map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={importForm.supplier}
                    onChange={(e) =>
                      setImportForm((prev) => ({
                        ...prev,
                        supplier: e.target.value,
                        supplierId: "",
                      }))
                    }
                    placeholder="Nhập tên nhà cung cấp"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  />
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Ghi chú
                </label>
                <textarea
                  value={importForm.note}
                  onChange={(e) =>
                    setImportForm((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Nhập ghi chú phiếu nhập hàng"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleCreateImportReceipt}
                disabled={isSubmittingImport}
                className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingImport ? "Đang tạo..." : "Xác nhận tạo phiếu nhập"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY STANDALONE IMPORT MODAL */}
      {isInventoryImportOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
                  <ClipboardList size={22} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Tạo yêu cầu nhập hàng
                </h3>
              </div>
              <button
                onClick={() => setIsInventoryImportOpen(false)}
                className="text-slate-400 transition hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <p className="mb-5 text-sm text-slate-500">
              Điền thông tin bên dưới để gửi yêu cầu nhập hàng lên Manager phê duyệt.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Sản phẩm cần nhập
                </label>
                <select
                  value={inventoryImportForm.variantId}
                  onChange={(e) => {
                    const p = products.find((x) => String(x.variantId) === e.target.value);
                    setInventoryImportForm((prev) => ({
                      ...prev,
                      variantId: e.target.value,
                      productId: p?.id ? String(p.id) : "",
                      productName: p?.name || "",
                      supplierId: p?.brand || "",
                      supplier: p?.brand || "",
                    }));
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-400"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((p) => (
                    <option key={p.variantId} value={p.variantId}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Số lượng nhập
                </label>
                <input
                  type="number"
                  min="1"
                  value={inventoryImportForm.quantity}
                  onChange={(e) =>
                    setInventoryImportForm((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  placeholder="Nhập số lượng"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-amber-400"
                />
              </div>

              {warehouses.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Kho nhập hàng
                  </label>
                  <select
                    value={inventoryImportForm.warehouseId}
                    onChange={(e) =>
                      setInventoryImportForm((prev) => ({ ...prev, warehouseId: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400"
                  >
                    <option value="">Chọn kho nhập hàng</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Thương hiệu / Nhà cung cấp
                </label>
                <select
                  value={inventoryImportForm.supplierId}
                  onChange={(e) => {
                    const s = brands.find((x) => String(x.id) === e.target.value);
                    setInventoryImportForm((prev) => ({
                      ...prev,
                      supplierId: e.target.value,
                      supplier: s?.name || "",
                    }));
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400"
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {(inventoryImportForm.variantId
                    ? brands.filter(b => b.id === products.find(p => String(p.variantId) === inventoryImportForm.variantId)?.brand)
                    : brands
                  ).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Ghi chú
                </label>
                <textarea
                  value={inventoryImportForm.note}
                  onChange={(e) =>
                    setInventoryImportForm((prev) => ({ ...prev, note: e.target.value }))
                  }
                  rows={3}
                  placeholder="Lý do nhập hàng, ghi chú thêm..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-400"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsInventoryImportOpen(false)}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateInventoryImportRequest}
                disabled={isSubmittingImport}
                className="flex-1 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingImport ? "Đang gửi..." : "Gửi yêu cầu lên Manager"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROCUREMENT MODAL */}
      {isProcurementModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
                  <ClipboardList size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Chi tiết phiếu {selectedReceipt.receiptCode}</h2>
              </div>
              <button onClick={() => setIsProcurementModalOpen(false)} className="rounded-full p-2 hover:bg-slate-100 text-slate-400 transition">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Trạng thái</p>
                  <ProcurementStatusBadge status={selectedReceipt.status} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Ngày tạo</p>
                  <p className="text-sm font-bold text-slate-900">{new Date(selectedReceipt.createdAt).toLocaleString("vi-VN")}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Người tạo</p>
                  <p className="text-sm font-bold text-slate-900">{selectedReceipt.createdByName}</p>
                </div>

              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Danh sách sản phẩm</h3>
                <div className="space-y-3">
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <div>
                        <p className="font-bold text-slate-900">{item.productName}</p>
                        <p className="text-xs text-slate-500">SKU: {item.sku} | {item.variantInfo}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReceipt.status === "Approved" && (
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Upload size={20} />
                    Xác nhận hàng về
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">Hàng đã về? Vui lòng tải ảnh bằng chứng (hóa đơn/sản phẩm) để gửi Manager xác nhận nhập kho.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-blue-900 mb-2">Bằng chứng hàng về (Hình ảnh)</label>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-200 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-blue-50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-blue-500" />
                          <p className="text-sm text-blue-600 font-medium">Bấm để chọn hoặc kéo thả ảnh</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEvidenceUrl(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {evidenceUrl && (
                        <div className="mt-3 relative w-fit">
                          <img src={evidenceUrl} className="h-20 rounded-lg border border-blue-100 shadow-sm" alt="Preview" />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setEvidenceUrl("");
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSubmitEvidence}
                      disabled={procurementLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition active:scale-[0.98] disabled:opacity-50"
                    >
                      {procurementLoading ? "Đang gửi..." : "Gửi bằng chứng cho Manager"}
                    </button>
                  </div>
                </div>
              )}

              {selectedReceipt.proofImage && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Bằng chứng nhập hàng</h3>
                  <img
                    src={selectedReceipt.proofImage}
                    alt="Proof"
                    className="w-full rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          setConfirmModal({ ...confirmModal, isOpen: false });
          confirmModal.action();
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />
    </div>
  );
}
