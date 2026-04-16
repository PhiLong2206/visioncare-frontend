export type OrderType = "ORDER" | "PRE-ORDER";
export type OrderStatus = "SENT TO LAB" | "AWAITING VERIFICATION" | "PROCESSING" | "CANCELLED";
export type PrescriptionStatus = "Verified" | "Manual Check Required" | "No Rx Attached";

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  orderType: OrderType;
  prescription: PrescriptionStatus;
  status: OrderStatus;
}

// 20 sample orders so pagination across 4 pages is visible
const BASE_ORDERS: Order[] = [
  { id: "ORD-8821", customer: "Eleanor Shellstrop", email: "e.shell@example.com", date: "Oct 24, 2023", orderType: "ORDER", prescription: "Verified", status: "SENT TO LAB" },
  { id: "ORD-8822", customer: "Chidi Anagonye", email: "chidi.a@university.edu", date: "Oct 24, 2023", orderType: "ORDER", prescription: "Manual Check Required", status: "AWAITING VERIFICATION" },
  { id: "ORD-8823", customer: "Tahani Al-Jamil", email: "tahani@social.uk", date: "Oct 23, 2023", orderType: "PRE-ORDER", prescription: "Verified", status: "PROCESSING" },
  { id: "ORD-8824", customer: "Jason Mendoza", email: "bortles@florida.com", date: "Oct 23, 2023", orderType: "ORDER", prescription: "No Rx Attached", status: "CANCELLED" },
  { id: "ORD-8825", customer: "Michael Realman", email: "michael@good.place", date: "Oct 22, 2023", orderType: "ORDER", prescription: "Verified", status: "SENT TO LAB" },
  { id: "ORD-8826", customer: "Janet Notarobot", email: "janet@void.space", date: "Oct 22, 2023", orderType: "ORDER", prescription: "Verified", status: "PROCESSING" },
  { id: "ORD-8827", customer: "Trevor Maplewood", email: "trevor@bad.place", date: "Oct 21, 2023", orderType: "PRE-ORDER", prescription: "Manual Check Required", status: "AWAITING VERIFICATION" },
  { id: "ORD-8828", customer: "Simone Garnett", email: "simone@sydney.au", date: "Oct 21, 2023", orderType: "ORDER", prescription: "Verified", status: "SENT TO LAB" },
  { id: "ORD-8829", customer: "Pillboi Johnson", email: "pillboi@jacksonville.com", date: "Oct 20, 2023", orderType: "ORDER", prescription: "No Rx Attached", status: "CANCELLED" },
  { id: "ORD-8830", customer: "Kamilah Al-Jamil", email: "kamilah@art.world", date: "Oct 20, 2023", orderType: "ORDER", prescription: "Verified", status: "PROCESSING" },
  { id: "ORD-8831", customer: "Doug Forcett", email: "doug@calgary.ca", date: "Oct 19, 2023", orderType: "ORDER", prescription: "Verified", status: "SENT TO LAB" },
  { id: "ORD-8832", customer: "Mindy St. Claire", email: "mindy@medium.place", date: "Oct 19, 2023", orderType: "PRE-ORDER", prescription: "Manual Check Required", status: "AWAITING VERIFICATION" },
  { id: "ORD-8833", customer: "Glenn Furlough", email: "glenn@accounting.com", date: "Oct 18, 2023", orderType: "ORDER", prescription: "Verified", status: "PROCESSING" },
  { id: "ORD-8834", customer: "Vicky Lightwood", email: "vicky@bad.place", date: "Oct 18, 2023", orderType: "ORDER", prescription: "No Rx Attached", status: "CANCELLED" },
  { id: "ORD-8835", customer: "Bambadjan Bamba", email: "bambadjan@good.place", date: "Oct 17, 2023", orderType: "ORDER", prescription: "Verified", status: "SENT TO LAB" },
  { id: "ORD-8836", customer: "Chris Baker", email: "chris@records.com", date: "Oct 17, 2023", orderType: "PRE-ORDER", prescription: "Verified", status: "PROCESSING" },
  { id: "ORD-8837", customer: "Linda Nguyen", email: "linda@clinic.vn", date: "Oct 16, 2023", orderType: "PRE-ORDER", prescription: "Manual Check Required", status: "AWAITING VERIFICATION" },
  { id: "ORD-8838", customer: "Sam Torres", email: "sam@optometry.com", date: "Oct 16, 2023", orderType: "PRE-ORDER", prescription: "Verified", status: "SENT TO LAB" },
  { id: "ORD-8839", customer: "Priya Mehta", email: "priya@vision.in", date: "Oct 15, 2023", orderType: "PRE-ORDER", prescription: "Verified", status: "PROCESSING" },
  { id: "ORD-8840", customer: "Omar Shaikh", email: "omar@eyecare.ae", date: "Oct 15, 2023", orderType: "PRE-ORDER", prescription: "No Rx Attached", status: "CANCELLED" },
];

export const ORDERS_PER_PAGE = 5;

export const ORDER_TYPE_STYLES: Record<OrderType, string> = {
  ORDER: "bg-blue-100 text-blue-700",
  // "ON SITE": "bg-green-100 text-green-700",
  "PRE-ORDER": "bg-purple-100 text-purple-700",
};

export const STATUS_STYLES: Record<OrderStatus, string> = {
  "SENT TO LAB": "bg-teal-100 text-teal-700",
  "AWAITING VERIFICATION": "bg-orange-100 text-orange-700",
  PROCESSING: "bg-gray-200 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export const TYPEITEMS = [
  {
    name: "Đã xác nhận",
    id: "SENT TO LAB"
  },
  {
    name: "Đợi kiểm tra",
    id: "AWAITING VERIFICATION"
  },
  {
    name: "Đang tiến hành",
    id: "PROCESSING"
  },
  {
    name: "Đã hủy",
    id: "CANCELLED"
  },
]

export const getAllOrders = async () => {
    return BASE_ORDERS;
}

export const transStatus = (order: Order) => {
  if(order.status === "SENT TO LAB") return "Đã xác nhận" 
  if(order.status === "AWAITING VERIFICATION") return "Đợi kiểm tra" 
  if(order.status === "PROCESSING") return "Đang tiến hành" 
  if(order.status === "CANCELLED") return "Đã hủy" 
}