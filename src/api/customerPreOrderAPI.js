const CUSTOMER_PRE_ORDER_API = "/api/v1/customer/pre-orders";

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function buildAuthHeaders(extraHeaders = {}) {
  const token = getAccessToken();

  return {
    accept: "*/*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function parseApiResponse(res, fallbackMessage) {
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(data?.message || data?.title || fallbackMessage);
  }

  return data;
}

export async function getMyReservations() {
  const res = await fetch(`${CUSTOMER_PRE_ORDER_API}/my-reservations`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không tải được danh sách đặt trước.");
}

export async function createPreOrderDepositLink(reservationId) {
  const res = await fetch(
    `${CUSTOMER_PRE_ORDER_API}/${reservationId}/create-deposit-link`,
    {
      method: "POST",
      headers: buildAuthHeaders(),
    }
  );

  return parseApiResponse(res, "Khong tao duoc link dat coc pre-order.");
}

export async function checkPreOrderDepositPaymentStatus(
  reservationId,
  paymentLinkId,
  type = "deposit"
) {
  const res = await fetch(
    `${CUSTOMER_PRE_ORDER_API}/${reservationId}/payment-status/${paymentLinkId}?type=${type}`,
    {
      method: "GET",
      headers: buildAuthHeaders(),
    }
  );

  return parseApiResponse(res, "Khong kiem tra duoc thanh toan.");
}

export async function createFinalPaymentLink(reservationId) {
  const res = await fetch(
    `${CUSTOMER_PRE_ORDER_API}/${reservationId}/create-final-payment-link`,
    {
      method: "POST",
      headers: buildAuthHeaders(),
    }
  );
  return parseApiResponse(res, "Không tạo được link thanh toán còn lại.");
}

export async function simulateFinalPayment(reservationId) {
  const res = await fetch(
    `${CUSTOMER_PRE_ORDER_API}/${reservationId}/simulate-final-payment`,
    {
      method: "POST",
      headers: buildAuthHeaders(),
    }
  );
  return parseApiResponse(res, "Không thực hiện được giả lập thanh toán.");
}

export async function completeConvertedOrder(orderId) {
  const res = await fetch(`/api/Orders/${orderId}/complete`, {
    method: "PUT",
    headers: buildAuthHeaders(),
  });
  return parseApiResponse(res, "Không thể xác nhận nhận hàng.");
}
