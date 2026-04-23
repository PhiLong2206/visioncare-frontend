/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const CART_API = "/api/Cart";

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function mapSingleCartItem(item) {
  return {
    cartItemId: item.cartItemId ?? item.id,
    cartItemIds: [item.cartItemId ?? item.id].filter(Boolean),
    variantId: item.variantId ?? item.VariantId ?? item.productVariantId,
    variantIds: [item.variantId ?? item.VariantId ?? item.productVariantId].filter(Boolean),
    name: item.productName ?? item.name ?? item.product?.productName,
    color: item.variantColor ?? item.color ?? item.variant?.color,
    size: item.variantSize ?? item.size ?? item.variant?.size,
    sku: item.sku,
    quantity: Number(item.quantity || 0),
    price: Number(item.campaignPrice ?? item.unitPrice ?? item.price ?? 0),
    campaignPrice: item.campaignPrice ? Number(item.campaignPrice) : null,
    stockQuantity: Number(item.stockQuantity ?? item.variant?.stockQuantity ?? 0),
    isPreOrder: Boolean(
      item.isPreOrder ??
        item.IsPreOrder ??
        item.variant?.product?.isPreOrder ??
        Number(item.stockQuantity ?? item.variant?.stockQuantity ?? 0) <= 0
    ),
    prescriptionId: item.prescriptionId,
    image:
      item.image ||
      item.image2D ||
      item.productImage ||
      item.product?.image2D ||
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    orderType:
      item.orderType ??
      item.type ??
      (item.isPreOrder ??
      item.IsPreOrder ??
      Number(item.stockQuantity ?? item.variant?.stockQuantity ?? 0) <= 0
        ? "pre-order"
        : null) ??
      (item.prescriptionId ? "prescription" : "in-stock"),
    depositAmount:
      (item.isPreOrder ??
      item.IsPreOrder ??
      Number(item.stockQuantity ?? item.variant?.stockQuantity ?? 0) <= 0
        ? Math.round(Number(item.campaignPrice ?? item.unitPrice ?? item.price ?? 0) * 0.3)
        : 0),
    isCombo: false,
  };
}

function mapCartItems(items = []) {
  const mappedItems = items.map(mapSingleCartItem);
  const groupedByPrescription = new Map();
  const normalItems = [];

  mappedItems.forEach((item) => {
    if (!item.prescriptionId) {
      normalItems.push(item);
      return;
    }

    const key = String(item.prescriptionId);
    groupedByPrescription.set(key, [
      ...(groupedByPrescription.get(key) || []),
      item,
    ]);
  });

  const prescriptionItems = Array.from(groupedByPrescription.values()).map(
    (group) => {
      if (group.length === 1) return group[0];

      const frameItem = group.find(
        (item) => !String(item.name || "").toLowerCase().includes("tròng")
      );
      const displayItem = frameItem || group[0];

      return {
        ...displayItem,
        cartItemIds: group.flatMap((item) => item.cartItemIds),
        variantIds: group.flatMap((item) => item.variantIds),
        name: "Combo kính theo toa",
        comboItems: group,
        isCombo: true,
        quantity: 1,
        price: group.reduce(
          (sum, item) => sum + item.price * Math.max(item.quantity, 1),
          0
        ),
        stockQuantity: Math.min(
          ...group.map((item) => item.stockQuantity || Number.MAX_SAFE_INTEGER)
        ),
        orderType: "prescription",
      };
    }
  );

  return [...normalItems, ...prescriptionItems];
}

function getCartItemId(item) {
  return item?.cartItemId ?? item?.id;
}

async function readErrorMessage(res, fallback) {
  try {
    const data = await res.json();
    return data?.message || data?.title || fallback;
  } catch {
    return fallback;
  }
}

function getCartItems(data) {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cartItems)) return data.cartItems;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.cartItems)) return data.data.cartItems;
  return [];
}

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetCart = useCallback(() => {
    setCart(null);
    setCartItems([]);
  }, []);

  const fetchCart = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      resetCart();
      return null;
    }

    try {
      setLoading(true);

      const res = await fetch(CART_API, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res, `API error: ${res.status}`));
      }

      const data = await res.json();
      setCart(data || null);
      setCartItems(mapCartItems(getCartItems(data)));

      return data;
    } catch (error) {
      console.error("Fetch cart failed:", error);
      resetCart();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [resetCart]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart().catch(() => {});
      return;
    }

    resetCart();
  }, [fetchCart, isLoggedIn, resetCart]);

  const addCartItem = async ({
    variantId,
    productId = null,
    quantity,
    prescriptionId = null,
  }) => {
    const token = getAccessToken();
    const parsedVariantId = Number(variantId);
    const parsedProductId = Number(productId);

    if (!token) {
      throw new Error("Bạn cần đăng nhập.");
    }

    if ((!parsedVariantId || parsedVariantId <= 0) && (!parsedProductId || parsedProductId <= 0)) {
      throw new Error("Khong tim thay bien the san pham hop le.");
    }

    const res = await fetch(`${CART_API}/items`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        variantId: parsedVariantId > 0 ? parsedVariantId : 0,
        ...(parsedProductId > 0 ? { productId: parsedProductId } : {}),
        quantity: Number(quantity),
        ...(prescriptionId ? { prescriptionId } : {}),
      }),
    });

    if (!res.ok) {
      throw new Error(
        await readErrorMessage(res, "Không thêm được vào giỏ hàng.")
      );
    }

    const data = await res.json().catch(() => null);

    if (data) {
      setCart(data);
      setCartItems(mapCartItems(getCartItems(data)));
      return data;
    }

    return fetchCart();
  };

  const addCartCombo = async ({
    frameVariantId,
    lensVariantId,
    prescription,
  }) => {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Bạn cần đăng nhập.");
    }

    const res = await fetch(`${CART_API}/combo`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        frameVariantId: Number(frameVariantId),
        lensVariantId: Number(lensVariantId),
        prescription,
      }),
    });

    if (!res.ok) {
      throw new Error(
        await readErrorMessage(res, "Không thêm được combo vào giỏ hàng.")
      );
    }

    const data = await res.json().catch(() => null);

    if (data) {
      setCart(data);
      setCartItems(mapCartItems(getCartItems(data)));
      return data;
    }

    return fetchCart();
  };

  const updateQuantity = async (item, newQuantity) => {
    const token = getAccessToken();
    const cartItemId = getCartItemId(item);

    if (!token) {
      throw new Error("Ban can dang nhap.");
    }

    if (!cartItemId) {
      throw new Error("Khong tim thay cart item id.");
    }

    if (newQuantity < 1) {
      await removeItem(item);
      return;
    }

    const res = await fetch(`${CART_API}/items/${cartItemId}`, {
      method: "PUT",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity: Number(newQuantity),
      }),
    });

    if (!res.ok) {
      throw new Error(
        await readErrorMessage(res, "Khong cap nhat duoc so luong.")
      );
    }

    const data = await res.json().catch(() => null);
    if (data) {
      setCart(data);
      setCartItems(mapCartItems(getCartItems(data)));
      return;
    }

    await fetchCart();
  };

  const removeItem = async (item) => {
    const token = getAccessToken();
    const cartItemIds = Array.isArray(item?.cartItemIds)
      ? item.cartItemIds
      : [getCartItemId(item)].filter(Boolean);

    if (!token) {
      throw new Error("Ban can dang nhap.");
    }

    if (cartItemIds.length === 0) {
      throw new Error("Khong tim thay cart item id.");
    }

    for (const cartItemId of cartItemIds) {
      const res = await fetch(`${CART_API}/items/${cartItemId}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res, "Khong xoa duoc san pham."));
      }
    }

    await fetchCart();
  };

  const clearCartApi = async () => {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Ban can dang nhap.");
    }

    const res = await fetch(CART_API, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        await readErrorMessage(res, "Khong xoa duoc toan bo gio hang.")
      );
    }

    resetCart();
  };

  const clearCart = () => {
    resetCart();
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = useMemo(() => {
    if (cart?.totalAmount !== undefined && cart?.totalAmount !== null) {
      return Number(cart.totalAmount);
    }

    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart, cartItems]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        totalPrice,
        loading,
        fetchCart,
        addCartItem,
        addCartCombo,
        updateQuantity,
        removeItem,
        clearCart,
        clearCartApi,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
