import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  Eye,
  Truck,
  Upload,
  X,
  CheckCircle2,
  Package,
  ChevronLeft,
  Settings2,
  Warehouse,
  ClipboardList,
  Clock3,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import OperationSidebar from "./OperationSidebar";

const initialOrders = [
  {
    id: "VC-2024-001",
    customerName: "Nguyễn Văn An",
    address: "12 Nguyễn Huệ, Q.1, TP.HCM",
    type: "Kính mắt / PK",
    total: 980000,
    status: "Hoàn thành",
    carrier: "GHN",
    trackingCode: "GHN123456789",
    item: {
      id: 1,
      name: "Classic Black Frame",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
      price: 980000,
      stock: 12,
    },
    prescription: null,
    importReceipt: null,
  },
  {
    id: "VC-2024-002",
    customerName: "Trần Thị Bình",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    type: "Gọng + Tròng",
    total: 990000,
    status: "Đang mài tròng",
    carrier: "",
    trackingCode: "",
    item: {
      id: 2,
      name: "Modern Square Black",
      image:
        "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=400&q=80",
      price: 990000,
      stock: 0,
    },
    prescription: {
      leftSPH: "-2.00",
      rightSPH: "-1.75",
      pd: "62",
      lensType: "single_vision",
    },
    importReceipt: null,
  },
  {
    id: "VC-2024-004",
    customerName: "Nguyễn Văn An",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    type: "Kính mắt / PK",
    total: 900000,
    status: "Đang giao hàng",
    carrier: "GHTK",
    trackingCode: "GHTK987654321",
    item: {
      id: 3,
      name: "Modern Metal Glasses",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      price: 900000,
      stock: 8,
    },
    prescription: null,
    importReceipt: null,
  },
  {
    id: "VC-2024-005",
    customerName: "Trần Thị Bình",
    address: "89 Hai Bà Trưng, Q.1, TP.HCM",
    type: "Gọng + Tròng",
    total: 1850000,
    status: "Đã xác nhận",
    carrier: "",
    trackingCode: "",
    item: {
      id: 4,
      name: "Premium Lens Combo",
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80",
      price: 1850000,
      stock: 6,
    },
    prescription: {
      leftSPH: "-1.50",
      rightSPH: "-1.25",
      pd: "64",
      lensType: "blue_cut",
    },
    importReceipt: null,
  },
  {
    id: "VC-2024-006",
    customerName: "Võ Thanh Hùng",
    address: "15 Trần Hưng Đạo, Q.5, TP.HCM",
    type: "Pre-order",
    total: 1280000,
    status: "Chờ nhập hàng",
    carrier: "",
    trackingCode: "",
    item: {
      id: 5,
      name: "Limited Edition Frame",
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80",
      price: 1280000,
      stock: 0,
    },
    prescription: null,
    importReceipt: null,
  },
  {
    id: "VC-2026-006",
    customerName: "Nguyễn Văn A",
    address: "22 Nguyễn Xiển, Q.9, TP.HCM",
    type: "Pre-order",
    total: 1000000,
    status: "Chờ nhập hàng",
    carrier: "",
    trackingCode: "",
    item: {
      id: 5,
      name: "Modern Square Black",
      image:
        "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=400&q=80",
      price: 1000000,
      stock: 0,
    },
    prescription: null,
    importReceipt: null,
  },
];

const TYPE_FILTERS = [
  "Tất cả",
  "Gọng + Tròng",
  "Pre-order",
  "Kính mắt / PK",
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function getStatusClass(status) {
  switch (status) {
    case "Hoàn thành":
      return "border border-green-200 bg-green-50 text-green-600";
    case "Đang giao hàng":
      return "border border-blue-200 bg-blue-50 text-blue-600";
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

function getTypeClass() {
  return "border border-slate-200 bg-white text-slate-800";
}

function getProcessingNextStatus(status, type) {
  if (type === "Gọng + Tròng") {
    switch (status) {
      case "Đã xác nhận":
        return "Đang mài tròng";
      case "Đang mài tròng":
        return "Đang lắp kính";
      case "Đang lắp kính":
        return "Đang đóng gói";
      case "Đang đóng gói":
        return "Sẵn sàng giao hàng";
      default:
        return status;
    }
  }

  if (type === "Pre-order") {
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
    default:
      return status;
  }
}

function getProcessList(order) {
  if (!order) return [];

  if (order.type === "Gọng + Tròng") {
    return [
      "Đã xác nhận",
      "Đang mài tròng",
      "Đang lắp kính",
      "Đang đóng gói",
      "Sẵn sàng giao hàng",
      "Đang giao hàng",
      "Hoàn thành",
    ];
  }

  if (order.type === "Pre-order") {
    return [
      "Đã xác nhận",
      "Chờ nhập hàng",
      "Chờ duyệt",
      "Đã nhập hàng",
      "Đang đóng gói",
      "Sẵn sàng giao hàng",
      "Đang giao hàng",
      "Hoàn thành",
    ];
  }

  return [
    "Đã xác nhận",
    "Đang đóng gói",
    "Sẵn sàng giao hàng",
    "Đang giao hàng",
    "Hoàn thành",
  ];
}

function getOperationTask(order) {
  if (!order) return "";

  if (order.type === "Gọng + Tròng") {
    return "Operation Staff thực hiện mài tròng, lắp kính, kiểm tra chất lượng, đóng gói và chuyển sang trạng thái sẵn sàng giao hàng.";
  }

  if (order.type === "Pre-order") {
    return 'Operation Staff chỉ tạo phiếu nhập hàng và chuyển đơn sang trạng thái "Chờ duyệt". Manager sẽ duyệt phiếu trước khi đơn được cập nhật thành "Đã nhập hàng".';
  }

  return "Operation Staff đóng gói sản phẩm, kiểm tra hoàn thiện và chuẩn bị bàn giao cho đơn vị vận chuyển.";
}

function buildInventoryFromOrders(orders) {
  const map = new Map();

  orders.forEach((order) => {
    const item = order.item;
    if (!item) return;

    if (!map.has(item.id)) {
      map.set(item.id, {
        id: item.id,
        name: item.name,
        type: order.type,
        image: item.image,
        stock: item.stock ?? 0,
      });
    } else {
      const current = map.get(item.id);
      if ((item.stock ?? 0) > current.stock) {
        current.stock = item.stock;
      }
    }
  });

  return Array.from(map.values());
}

export default function OperationPage() {
  const [activeNav, setActiveNav] = useState("ORDER_PROCESSING");
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [typeFilter, setTypeFilter] = useState("Tất cả");
  const [shippingForm, setShippingForm] = useState({
    carrier: "",
    trackingCode: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importForm, setImportForm] = useState({
    quantity: "",
    supplier: "",
    note: "",
  });

  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const isOperationUser = useMemo(() => {
    if (!user) return false;
    if (user.roleId != null) return Number(user.roleId) === 4;
    return user.role === "Operations";
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

  const preOrderOrders = orders.filter((order) => order.type === "Pre-order");

  const deliveryOrders = orders.filter((order) =>
    ["Sẵn sàng giao hàng", "Đang giao hàng", "Hoàn thành"].includes(
      order.status
    )
  );

  const inventoryItems = buildInventoryFromOrders(orders);

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

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setShippingForm({
      carrier:
        order.carrier && order.carrier !== "Chưa chọn" ? order.carrier : "",
      trackingCode:
        order.trackingCode && order.trackingCode !== "—"
          ? order.trackingCode
          : "",
    });
    setPreviewImages([]);
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

  const handleUpdateProcessingStatus = () => {
    if (!selectedOrder) return;

    const nextStatus = getProcessingNextStatus(
      selectedOrder.status,
      selectedOrder.type
    );

    if (nextStatus === selectedOrder.status) {
      toast("Đơn này không có bước xử lý nội bộ tiếp theo.");
      return;
    }

    const updatedOrder = {
      ...selectedOrder,
      status: nextStatus,
    };

    setSelectedOrder(updatedOrder);
    setOrders((prev) =>
      prev.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
    );

    toast.success(`Đã chuyển trạng thái sang "${nextStatus}"`);
  };

  const handleUpdateDeliveryStatus = () => {
    if (!selectedOrder) return;

    const nextStatus = getDeliveryNextStatus(selectedOrder.status);

    if (nextStatus === selectedOrder.status) {
      toast(
        "Operation Staff chỉ cập nhật đến trạng thái Đang giao hàng. Khách hàng sẽ xác nhận hoàn thành."
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
  };

  const handleOpenImportModal = () => {
    if (!selectedOrder) return;
    setImportForm({
      quantity: "",
      supplier: "",
      note: "",
    });
    setIsImportModalOpen(true);
  };

  const handleCreateImportReceipt = () => {
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

    const quantity = Number(importForm.quantity);

    const updatedOrder = {
      ...selectedOrder,
      status: "Chờ duyệt",
      importReceipt: {
        receiptCode: `IMP-${Date.now()}`,
        quantity,
        supplier: importForm.supplier,
        note: importForm.note,
        createdAt: new Date().toISOString().split("T")[0],
        status: "Pending",
      },
    };

    setSelectedOrder(updatedOrder);
    setOrders((prev) =>
      prev.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
    );
    setIsImportModalOpen(false);

    toast.success("Đã tạo phiếu nhập hàng. Đơn đang chờ Manager duyệt.");
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
    selectedOrder.type === "Pre-order" &&
    activeNav === "PRE_ORDER";

  const isDeliveryModal =
    selectedOrder &&
    ["Sẵn sàng giao hàng", "Đang giao hàng", "Hoàn thành"].includes(
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
              {TYPE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTypeFilter(filter)}
                  className={`rounded-[14px] px-5 py-3 text-[15px] font-semibold transition ${
                    typeFilter === filter
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
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <Warehouse size={20} className="text-slate-700" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Kho sản phẩm
                  </h2>
                </div>
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
                    {filteredOrders.map((item) => (
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
                            className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${
                              item.stock > 0
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
                    {filteredOrders.map((order) => (
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
                            className={`inline-flex whitespace-nowrap rounded-full px-4 py-1.5 text-[15px] font-semibold ${getTypeClass(
                              order.type
                            )}`}
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
                          <button
                            onClick={() => handleOpenOrder(order)}
                            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-50"
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredOrders.length === 0 && (
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
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.5fr_0.9fr]">
        {/* LEFT */}
        <div className="min-h-0 overflow-y-auto px-8 py-6">
          {/* STEPPER */}
          <div
            className={`mb-6 grid gap-2 ${
              processList.length >= 7 ? "grid-cols-7" : "grid-cols-5"
            }`}
          >
            {processList.map((step, index) => {
              const completed = index < currentProcessIndex;
              const active = index === currentProcessIndex;
              const isReached = completed || active;

              return (
                <div
                  key={step}
                  className="relative flex flex-col items-center text-center"
                >
                  {index < processList.length - 1 && (
                    <div
                      className={`absolute left-[58%] top-5 h-[2px] w-[84%] ${
                        index < currentProcessIndex
                          ? "bg-teal-500"
                          : "bg-slate-200"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      isReached
                        ? "bg-teal-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {completed ? <CheckCircle2 size={16} /> : index + 1}
                  </div>

                  <p className="mt-2 text-xs font-medium leading-4 text-slate-700">
                    {step}
                  </p>
                </div>
              );
            })}
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
          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xl font-semibold text-slate-900">
              Nhiệm vụ vận hành
            </h3>

            <p className="text-base leading-8 text-slate-600">
              {getOperationTask(selectedOrder)}
            </p>

            {selectedOrder.type === "Pre-order" &&
              selectedOrder.status === "Chờ nhập hàng" && (
                <p className="mt-3 text-sm font-medium text-orange-600">
                  ⚠ Cần tạo phiếu nhập hàng trước khi chuyển cho Manager duyệt
                </p>
              )}

            {selectedOrder.type === "Pre-order" &&
              selectedOrder.status === "Chờ duyệt" && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700">
                  <Clock3 size={18} />
                  <span className="font-medium">
                    Phiếu nhập đang chờ Manager duyệt
                  </span>
                </div>
              )}
          </div>

          {/* PRODUCT */}
          <div className="mb-5 rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white">
                  <img
                    src={selectedOrder.item?.image}
                    alt={selectedOrder.item?.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-2xl font-medium text-slate-900">
                    {selectedOrder.item?.name}
                  </p>
                </div>
              </div>

              <p className="text-2xl font-semibold text-slate-900">
                {formatCurrency(selectedOrder.item?.price)}
              </p>
            </div>
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

            {/* Pre-order */}
            {isPreOrderModal && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <ClipboardList className="text-slate-700" size={20} />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Nhập hàng Pre-order
                  </h3>
                </div>

                <p className="mb-4 text-sm leading-7 text-slate-600">
                  Operation Staff tạo phiếu nhập hàng, sau đó đơn sẽ chuyển sang
                  Chờ duyệt để Manager xử lý.
                </p>

                {selectedOrder.status === "Chờ nhập hàng" && (
                  <button
                    type="button"
                    onClick={handleOpenImportModal}
                    className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    Tạo phiếu nhập hàng
                  </button>
                )}

                {selectedOrder.status === "Chờ duyệt" && (
                  <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-700">
                    Phiếu đã tạo xong. Đơn đang chờ Manager duyệt.
                  </div>
                )}

                {selectedOrder.status === "Đã nhập hàng" && (
                  <div className="rounded-2xl border border-lime-200 bg-lime-50 px-4 py-4 text-sm text-lime-700">
                    Đơn đã được Manager duyệt nhập hàng và có thể tiếp tục xử lý.
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
                      <option value="GHTK">GHTK</option>
                      <option value="GHN">GHN</option>
                      <option value="Viettel Post">Viettel Post</option>
                      <option value="J&T Express">J&T Express</option>
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
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-700">
                    Đơn đang giao tới khách. Khách hàng sẽ xác nhận đã nhận hàng.
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
                  !(selectedOrder.type === "Pre-order" &&
                    ["Chờ nhập hàng", "Chờ duyệt"].includes(
                      selectedOrder.status
                    )) && (
                    <button
                      type="button"
                      onClick={handleUpdateProcessingStatus}
                      disabled={selectedOrder.status === "Sẵn sàng giao hàng"}
                      className={`rounded-2xl px-5 py-3 font-semibold text-white transition ${
                        selectedOrder.status === "Sẵn sàng giao hàng"
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
                      selectedOrder.status === "Hoàn thành"
                    }
                    className={`rounded-2xl px-5 py-3 font-semibold text-white transition ${
                      selectedOrder.status === "Đang giao hàng" ||
                      selectedOrder.status === "Hoàn thành"
                        ? "cursor-not-allowed bg-slate-300"
                        : "bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90"
                    }`}
                  >
                    {selectedOrder.status === "Sẵn sàng giao hàng" &&
                      "Bắt đầu giao hàng"}
                    {selectedOrder.status === "Đang giao hàng" &&
                      "Chờ khách xác nhận"}
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

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Nhà cung cấp
                </label>
                <input
                  type="text"
                  value={importForm.supplier}
                  onChange={(e) =>
                    setImportForm((prev) => ({
                      ...prev,
                      supplier: e.target.value,
                    }))
                  }
                  placeholder="Nhập tên nhà cung cấp"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
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
                className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Xác nhận tạo phiếu nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}