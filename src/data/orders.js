import kinh1 from "../assets/images/kinh1.jpg";
import kinh2 from "../assets/images/kinh2.jpg";
import kinh4 from "../assets/images/kinh4.jpg";
import gongkinh1 from "../assets/images/gongkinh1.jpg";

export const orders = [
  {
    id: "VC-2024-001",
    date: "2024-03-01",
    status: "Hoàn thành",
    shippingUnit: "GHN",
    trackingCode: "GHN123456789",
    total: 1250000,
    items: [
      {
        id: 1,
        name: "Classic Aviator Gold",
        image: kinh1,
        quantity: 1,
        price: 1250000,
        color: "Vàng",
        size: "M",
      },
    ],
  },
  {
    id: "VC-2024-002",
    date: "2024-03-10",
    status: "Đang xử lý",
    shippingUnit: "GHN",
    trackingCode: "GHN987654321",
    total: 890000,
    items: [
      {
        id: 2,
        name: "Modern Square Black",
        image: kinh2,
        quantity: 1,
        price: 890000,
        color: "Đen",
        size: "L",
      },
    ],
  },
  {
    id: "VC-2024-003",
    date: "2024-03-15",
    status: "Chờ xác nhận",
    shippingUnit: "GHN",
    trackingCode: "GHN555666777",
    total: 1450000,
    items: [
      {
        id: 3,
        name: "Elegant Cat-Eye Rose",
        image: kinh4,
        quantity: 1,
        price: 1450000,
        color: "Hồng",
        size: "S",
      },
    ],
  },
  {
    id: "VC-2024-004",
    date: "2024-03-20",
    status: "Hoàn thành",
    shippingUnit: "GHN",
    trackingCode: "GHN222333444",
    total: 2100000,
    items: [
      {
        id: 4,
        name: "Titanium Ditano Helio Vault D125",
        image: gongkinh1,
        quantity: 1,
        price: 2100000,
        color: "Bạc",
        size: "M",
      },
    ],
  },
];