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
      name: "Classic Black Frame",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
      price: 980000,
    },
    prescription: null,
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
      name: "Modern Square Black",
      image:
        "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=400&q=80",
      price: 990000,
    },
    prescription: {
      leftSPH: "-2.00",
      rightSPH: "-1.75",
      pd: "62",
      lensType: "single_vision",
    },
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
      name: "Modern Metal Glasses",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      price: 900000,
    },
    prescription: null,
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
      name: "Premium Lens Combo",
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80",
      price: 1850000,
    },
    prescription: {
      leftSPH: "-1.50",
      rightSPH: "-1.25",
      pd: "64",
      lensType: "blue_cut",
    },
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
      name: "Limited Edition Frame",
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80",
      price: 1280000,
    },
    prescription: null,
  },
];

const ORDER_STEPS = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang xử lý",
  "Sẵn sàng giao hàng",
  "Đang giao hàng",
  "Hoàn thành",
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
    case "Đã nhập hàng":
      return "border border-yellow-200 bg-yellow-50 text-yellow-700";
    default:
      return "border border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getTypeClass(type) {
  switch (type) {
    case "Gọng + Tròng":
      return "border border-slate-200 bg-white text-slate-800";
    case "Pre-order":
      return "border border-slate-200 bg-white text-slate-800";
    case "Kính mắt / PK":
      return "border border-slate-200 bg-white text-slate-800";
    default:
      return "border border-slate-200 bg-white text-slate-800";
  }
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
      case "Đã xác nhận":
        return "Chờ nhập hàng";
      case "Chờ nhập hàng":
        return "Đã nhập hàng";
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

function getDisplayStepNumber(status) {
  switch (status) {
    case "Chờ xác nhận":
      return 1;
    case "Đã xác nhận":
      return 2;
    case "Đang xử lý":
    case "Đang mài tròng":
    case "Đang lắp kính":
    case "Chờ nhập hàng":
    case "Đã nhập hàng":
    case "Đang đóng gói":
      return 3;
    case "Sẵn sàng giao hàng":
      return 4;
    case "Đang giao hàng":
      return 5;
    case "Hoàn thành":
      return 6;
    default:
      return 1;
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
    return "Operation Staff theo dõi tình trạng hết hàng, nhập hàng về kho, cập nhật đã nhập hàng, kiểm tra sản phẩm, đóng gói và chuẩn bị bàn giao vận chuyển.";
  }

  return "Operation Staff đóng gói sản phẩm, kiểm tra hoàn thiện và chuẩn bị bàn giao cho đơn vị vận chuyển.";
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
      "Chờ nhập hàng",
      "Đã nhập hàng",
      "Đang đóng gói",
      "Sẵn sàng giao hàng",
    ].includes(order.status)
  );

  const deliveryOrders = orders.filter((order) =>
    ["Sẵn sàng giao hàng", "Đang giao hàng", "Hoàn thành"].includes(order.status)
  );

  const baseOrders =
    activeNav === "ORDER_PROCESSING" ? processingOrders : deliveryOrders;

  const filteredOrders =
    typeFilter === "Tất cả"
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

  const isProcessingModal =
    selectedOrder &&
    [
      "Đã xác nhận",
      "Đang xử lý",
      "Đang mài tròng",
      "Đang lắp kính",
      "Chờ nhập hàng",
      "Đã nhập hàng",
      "Đang đóng gói",
      "Sẵn sàng giao hàng",
    ].includes(selectedOrder.status) &&
    activeNav === "ORDER_PROCESSING";

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
                <span className="font-semibold text-slate-700">• Gọng + Tròng:</span>{" "}
                Mài tròng → Lắp kính → Kiểm tra CL → Đóng gói → Sẵn sàng giao hàng → Nhập mã vận đơn
              </p>
              <p>
                <span className="font-semibold text-slate-700">• Pre-order:</span>{" "}
                Chờ nhập hàng → Đã nhập hàng → Đóng gói → Sẵn sàng giao hàng → Nhập mã vận đơn
              </p>
              <p>
                <span className="font-semibold text-slate-700">• Kính mắt / PK:</span>{" "}
                Đóng gói → Sẵn sàng giao hàng → Nhập mã vận đơn
              </p>
            </div>
          </div>

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
                    <th className="px-6 py-5 text-right font-medium">Thao tác</th>
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
                        Không có đơn hàng phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-[28px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
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

            <div className="px-8 py-8">
              <div className={`mb-8 grid gap-2 ${processList.length >= 7 ? "grid-cols-7" : "grid-cols-6"}`}>
                {processList.map((step, index) => {
                  const stepNumber = index;
                  const completed = stepNumber < currentProcessIndex;
                  const active = stepNumber === currentProcessIndex;
                  const isReached = completed || active;

                  return (
                    <div
                      key={step}
                      className="relative flex flex-col items-center text-center"
                    >
                      {index < processList.length - 1 && (
                        <div
                          className={`absolute left-[58%] top-5 h-[2px] w-[84%] ${
                            stepNumber < currentProcessIndex
                              ? "bg-teal-500"
                              : "bg-slate-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                          isReached
                            ? "bg-teal-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {completed ? <CheckCircle2 size={18} /> : index + 1}
                      </div>

                      <p className="mt-3 text-sm font-medium leading-5 text-slate-700">
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-lg text-slate-500">Khách hàng</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {selectedOrder.customerName}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-lg text-slate-500">Địa chỉ</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {selectedOrder.address}
                  </p>
                </div>
              </div>

              <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-2xl font-semibold text-slate-900">
                  Nhiệm vụ vận hành
                </h3>

                <p className="text-lg leading-8 text-slate-600">
                  {getOperationTask(selectedOrder)}
                </p>
              </div>

              <div className="mb-8 rounded-3xl bg-slate-50 p-4">
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

              {selectedOrder.prescription && (
                <div className="mb-8 rounded-3xl bg-teal-50 p-6">
                  <h3 className="mb-4 text-2xl font-semibold text-teal-800">
                    Thông tin toa kính
                  </h3>

                  <div className="grid grid-cols-1 gap-4 text-xl text-slate-800 md:grid-cols-2">
                    <p>L-SPH: {selectedOrder.prescription.leftSPH}</p>
                    <p>R-SPH: {selectedOrder.prescription.rightSPH}</p>
                    <p>PD: {selectedOrder.prescription.pd}</p>
                    <p>Loại tròng: {selectedOrder.prescription.lensType}</p>
                  </div>
                </div>
              )}

              {isProcessingModal && (
                <>
                  <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <Package size={22} className="text-slate-700" />
                      <h3 className="text-2xl font-semibold text-slate-900">
                        Xử lý nội bộ
                      </h3>
                    </div>

                    <p className="text-lg leading-8 text-slate-600">
                      Ở bước này Operation Staff thực hiện xử lý nội bộ theo đúng loại đơn.
                      Riêng pre-order sẽ có thêm bước nhập hàng trước khi đóng gói.
                      Việc chọn đơn vị vận chuyển và nhập mã vận đơn sẽ thực hiện tại tab Giao hàng.
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="mb-4 text-2xl font-semibold text-slate-900">
                      Upload ảnh sản phẩm / đóng gói
                    </h3>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-teal-300 bg-white px-6 py-12 text-center transition hover:bg-teal-50">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUploadImages}
                        className="hidden"
                      />
                      <Upload size={34} className="mb-3 text-slate-400" />
                      <span className="text-xl font-medium text-slate-600">
                        Kéo thả hoặc click để upload
                      </span>
                    </label>

                    {previewImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {previewImages.map((img, index) => (
                          <div
                            key={`${img.name}-${index}`}
                            className="relative overflow-hidden rounded-2xl border border-slate-200"
                          >
                            <img
                              src={img.preview}
                              alt={img.name}
                              className="h-36 w-full object-cover"
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
                </>
              )}

              {isDeliveryModal && (
                <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Truck className="text-slate-700" size={22} />
                    <h3 className="text-2xl font-semibold text-slate-900">
                      Giao hàng
                    </h3>
                  </div>

                  <p className="mb-4 text-lg leading-8 text-slate-600">
                    Tại bước này Operation Staff bàn giao đơn cho đơn vị vận chuyển và nhập mã vận đơn.
                    Khi khách hàng nhận được hàng, phía khách sẽ xác nhận hoàn thành trên website.
                  </p>

                  {selectedOrder.status === "Sẵn sàng giao hàng" && (
                    <>
                      <select
                        value={shippingForm.carrier}
                        onChange={(e) =>
                          handleShippingChange("carrier", e.target.value)
                        }
                        className="w-full rounded-2xl border-2 border-teal-500 bg-white px-5 py-4 text-xl outline-none"
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
                        className="mt-4 w-full rounded-2xl border border-slate-200 px-5 py-4 text-xl outline-none transition focus:border-slate-400"
                      />
                    </>
                  )}

                  {selectedOrder.status === "Đang giao hàng" && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-blue-700">
                      Đơn hàng đang giao tới khách. Khách hàng sẽ xác nhận đã nhận hàng để hệ thống chuyển sang Hoàn thành.
                    </div>
                  )}

                  {selectedOrder.status === "Hoàn thành" && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-green-700">
                      Đơn hàng đã được khách xác nhận nhận thành công.
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleCloseOrder}
                  className="rounded-2xl border border-slate-200 px-6 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Đóng
                </button>

                {isProcessingModal && (
                  <button
                    type="button"
                    onClick={handleUpdateProcessingStatus}
                    disabled={selectedOrder.status === "Sẵn sàng giao hàng"}
                    className={`rounded-2xl px-6 py-4 text-lg font-semibold text-white transition ${
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
                    className={`rounded-2xl px-6 py-4 text-lg font-semibold text-white transition ${
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
      )}
    </div>
  );
}